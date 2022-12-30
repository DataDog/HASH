const fs = require('fs')
const yaml = require('js-yaml');
const log = require('./log')


class Template{
    constructor(app){
        this.dir = app.templatesDir
    }
    load(){
        log('Template', 'loading request templates from: '+this.dir)
        const dirents = fs.readdirSync(this.dir, { withFileTypes: true });
        const filesNames = dirents
        .filter(dirent => dirent.isFile())
        .map(dirent => dirent.name);
    
        let templates = [];
        for (let index = 0; index < filesNames.length; index++) {
            const template = filesNames[index];
            
            try {
                let doc = yaml.load(fs.readFileSync(this.dir + '/' + template, 'utf8')); 
                log('Template', 'loading template: '+template +' success ')
                templates.push(doc)
            } catch (e) {
                
                log('Template', 'loading template: '+template +' Failed ', 'warning')
                log('Template', e, 'warning')
            }
        }
        return templates;
    }
}

module.exports = Template