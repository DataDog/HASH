// const express = require('express')
const fs = require('fs')

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
        console.log('Simulation: Mocking request ', template.info.title)
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
                console.log('Simulation: --- Trap hit, marking the session as malicious', req.session)
                req.session.isMalicious = true
            }
 
            //report the malicious activities to DD
            if(req.session.isMalicious){
                this.http.logger(template.id, template.info.title, template.info)
            }

            // if(request.log || req.session.isMalicious){ //TODO: refactor this one
            //     //mark the user as malicious
            //     req.session.isMalicious = true;
            //     http.logger(template.id, template.info.title, template.info) 
            // }
            
            res.set(reply.headers)
            if(reply.body.view){
                let viewContents = fs.readFileSync(this.app.resourcesDir + "/" +reply.body.view)
                //TODO: add try & catch
                //TODO: fix path
                res.status(reply.status).send(viewContents)
            }else{
                res.status(reply.status).send(reply.body.contents)
            }
        }
    }
}




// // const sitemapURLs = [];

// const apply = (http,templates) => {
//     for (let index = 0; index < templates.length; index++) {
//         mockTemplate(http, templates[index])
//     }
// }


// const mockTemplate = (http, template) => {
//     for (const request of template.requests) {
//         mockRequest(http, request, template)
//     }

//     // buildSitemap()
// }

// const mockRequest = (http, request, template) => {
//     let expect = request.expect;
    
    
//     console.log('Simulation: Mocking request ', template.info.title)
//     switch (expect.method){
//         case 'GET':
//             http.get(expect.path, handler(http, request, template))
//             break;
//         case 'POST':
//             http.post(expect.path, handler(http, request, template))
//             break;
//     }

//     if(!request.hidden){
//         console.log('Simulation: --- Adding it to the sitemap')
//         // sitemapURLs.push(expect.path)
//     }

// }


// const handler = (http, request, template) => {
//     let reply = request.reply;
//     return (req,res) => {
//         if(request.log || req.session.isMalicious){ //TODO: refactor this one
//             //mark the user as malicious
//             req.session.isMalicious = true;
//             http.logger(template.id, template.info.title, template.info) 
//         }
        
//         res.set(reply.headers)
//         if(reply.body.view){
//             let viewContents = fs.readFileSync("templates/resources/"+reply.body.view)
//             //TODO: add try & catch
//             //TODO: fix path
//             res.status(reply.status).send(viewContents)
//         }else{
//             res.status(reply.status).send(reply.body.contents)
//         }
//     }
//}

module.exports = Simulator

//module.exports = { apply }

// module.exports = (app) => {

//     return {
//         apply
//     }
// }