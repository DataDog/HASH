const { config } = require('dotenv');
const fs = require('fs')
const path = require('path');
const log = require('./log')
const randomizer = require('./randomizer')
const honeytraps = {
    robots: require('./honeytraps/robots-txt'),
    exposedFiles: require('./honeytraps/exposed-files'),
    cookies: require('./honeytraps/cookie')
}


class Simulator{
    constructor(app, http, templates, dynamicTemplates){
        this.app = app
        this.http = http
        this.templates = templates
        this.dynamicTemplates = dynamicTemplates
    }

    apply(config){ 
        //built-in modules
        //TODO: check config
        this.builtinModules(config)

        for (let index = 0; index < this.dynamicTemplates.length; index++) {
            this.mockDynamicRequest(this.dynamicTemplates[index]);
        }
        
        for (let index = 0; index < this.templates.length; index++) { 
            //check if its dynamic js file
            this.mockTemplate(this.templates[index])
        }

        

    }

    builtinModules(config){

        if(config.disableBuiltIn && config.disableBuiltIn.includes('traps')){
            return;
        }
        //load internal honeytraps
        //TODO: enable/disable internal module by config
        honeytraps.robots(this.http);
        honeytraps.exposedFiles(this.http)
        honeytraps.cookies(this.http)
        
    }


    mockDynamicRequest(template){
        log('Simulator', 'Mocking Dynamic request '+ template) 
        require(template)(this.http);
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
            //TODO: add more http methods
            case 'GET':
                this.http.get(expect.path, this.handler(request, template, expect))
                break;
            case 'POST':
                this.http.post(expect.path, this.handler(request, template, expect))
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
 
            if(reply.body.static){
                console.log('Loading static file FROM', this.app.resourcesDir + "/" +request.reply.body.static)
                let staticC = fs.readFileSync(this.app.resourcesDir + "/" +request.reply.body.static)
                res.status(reply.status).send(staticC)  
                return; 
            }

            let templateVars = Object.assign({
                params: req.params,
                body: req.body,
                query: req.query
            }, reply.body.vars || {})
            
            
            let enableCache = reply.body.cache === false ?  false : true; //default is true
            let renderedContents = randomizer.render(req,reply.body.contents, templateVars, enableCache);

            res.status(reply.status).send(renderedContents)
        }
    }

}


module.exports = Simulator