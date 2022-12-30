const fs = require('fs')
const log = require('./log')
const randomizer = require('./randomizer')
const honeytraps = {
    robots: require('./honeytraps/robots-txt'),
    exposedFiles: require('./honeytraps/exposed-files'),
    cookies: require('./honeytraps/cookie')
}


class Simulator{
    constructor(app, http, templates){
        this.app = app
        this.http = http
        this.templates = templates
    }

    apply(){ 
        //built-in modules
        //TODO: check config
        this.builtinModules()

 
        for (let index = 0; index < this.templates.length; index++) { 
            this.mockTemplate(this.templates[index])
        }
    }

    builtinModules(){
        //load internal honeytraps
        honeytraps.robots(this.http);
        honeytraps.exposedFiles(this.http)
        honeytraps.cookies(this.http)
        
    }

    mockTemplate(template){
        for (const request of template.requests) {
            this.mockRequest(request, template)
        }
    }

    mockRequest(request, template){ 
        let expect = request.expect;
        log('Simulator', 'Mocking request '+ template.id)
        
        //parse reply 
        if(request.reply.body.view){
            let viewContents = fs.readFileSync(this.app.resourcesDir + "/" +request.reply.body.view, {encoding:'utf8'})   
            request.reply.body.contents = viewContents; 
        }
 

        switch (expect.method){
            case 'GET':
                this.http.get(expect.path, this.handler(request, template))
                break;
            case 'POST':
                this.http.post(expect.path, this.handler(request, template))
                break;
        }
    }

    handler(request, template){
        let reply = request.reply;
        return (req,res) => {

            //if this a trap mark the full session as malicious
            if(request.isTrap){
                log('Simulator', 'Trap hit, marking the session as malicious ', 'warning')
                req.session.isMalicious = true
            }
 
            //report the malicious activities to DD
            if(req.session.isMalicious){
                this.http.logger(template.id, template.info.title, template.info)
            }

            
            res.set(reply.headers)

            let templateVars = Object.assign({
                params: req.params
            }, reply.body.vars || {})
            
            
            let renderedContents = randomizer.render(req,reply.body.contents, templateVars);

            res.status(reply.status).send(renderedContents)
        }
    }

}


module.exports = Simulator