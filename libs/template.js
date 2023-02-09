const fs = require('fs')
const path = require('path');
const yaml = require('js-yaml');
const log = require('./log')


class Template{
    constructor(app){
        this.dir = app.templatesDir
    }
    load(){
        log('Template', 'loading request templates from: '+this.dir);
        const dirents = fs.readdirSync(this.dir, { withFileTypes: true });
        const filesNames = dirents
        .filter(dirent => dirent.isFile())
        .map(dirent => dirent.name);
    
        let templates = [];
        let dynamicTemplates = [];
        let specialTemplates = [];

        for (let index = 0; index < filesNames.length; index++) {
            const template = filesNames[index];
            
            let ext = path.extname(template);
            if(ext == '.js'){
                //dynamically loaded js
                //add the filename to be required later 
                dynamicTemplates.push(this.dir + '/' + template);
                continue;
            }

            if(ext != '.yaml' && ext != '.yml') continue; //unsupported file format 
            try {
                let doc = yaml.load(fs.readFileSync(this.dir + '/' + template, 'utf8')); 
                log('Template', 'loading template: '+template +' success ')

                if(template == '404.yaml' || template == '404.yml'){
                    specialTemplates.push(doc)
                    continue;
                }
                templates.push(doc)
            } catch (e) {
                
                log('Template', 'loading template: '+template +' Failed ', 'warning')
                log('Template', e, 'warning')
            }
        }

        
        return {
            templates: [...templates, ...specialTemplates],
            dynamicTemplates
        };
    }
}

module.exports = Template