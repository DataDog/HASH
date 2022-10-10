const express = require('express')
const fs = require('fs')
const sitemapURLs = [];

const apply = (app,templates) => {
    for (let index = 0; index < templates.length; index++) {
        mockTemplate(app, templates[index])
    }
}


const mockTemplate = (app, template) => {
    for (const request of template.requests) {
        mockRequest(app, request, template)
    }

    buildSitemap()
}

const mockRequest = (app, request, template) => {
    let expect = request.expect;
    
    
    console.log('Simulation: Mocking request ', template.info.title)
    switch (expect.method){
        case 'GET':
            app.get(expect.path, handler(app, request, template))
            break;
        case 'POST':
            app.post(expect.path, handler(app, request, template))
            break;
    }

    if(!request.hidden){
        console.log('Simulation: --- Adding it to the sitemap')
        sitemapURLs.push(expect.path)
    }

}


const handler = (app, request, template) => {
    let reply = request.reply;
    return (req,res) => {
        if(request.log || req.session.isMalicious){
            //mark the user as malicious
            req.session.isMalicious = true;
            app.logger(template.id, template.info.title, template.info) 
        }
        
        res.set(reply.headers)
        if(reply.body.view){
            let viewContents = fs.readFileSync("templates/resources/"+reply.body.view)
            //TODO: add try & catch
            //TODO: fix path
            res.status(reply.status).send(viewContents)
        }else{
            res.status(reply.status).send(reply.body.contents)
        }
    }
}

const buildSitemap = () => {
    console.log(sitemapURLs)
}

module.exports = { apply }