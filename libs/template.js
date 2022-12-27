const fs = require('fs')
const yaml = require('js-yaml');



class Template{
    constructor(app){
        this.dir = app.templatesDir
    }
    load(){
        console.log('Templates: loading request templates from:', this.dir)
        const dirents = fs.readdirSync(this.dir, { withFileTypes: true });
        const filesNames = dirents
        .filter(dirent => dirent.isFile())
        .map(dirent => dirent.name);
    
        let templates = [];
        for (let index = 0; index < filesNames.length; index++) {
            const template = filesNames[index];
            
            try {
                let doc = yaml.load(fs.readFileSync(this.dir + '/' + template, 'utf8'));
                console.log('Templates: loading template: ', template, ' -> success')
                templates.push(doc)
            } catch (e) {
                console.log(e)
                console.log('Templates: loading template: ', template, ' -> failed')
            }
        }
        return templates;
    }
}



/**
 * 
 * @param {string} dir 
 * @returns 
 */
// const load = (app) => {
//     const dir = app.templatesDir;
//     console.log('Templates: loading request templates from:', dir)
//     const dirents = fs.readdirSync(dir, { withFileTypes: true });
//     const filesNames = dirents
//     .filter(dirent => dirent.isFile())
//     .map(dirent => dirent.name);

//     let templates = [];
//     for (let index = 0; index < filesNames.length; index++) {
//         const template = filesNames[index];
        
//         try {
//             doc = yaml.load(fs.readFileSync(dir + '/' + template, 'utf8'));
//             console.log('Templates: loading template: ', template, ' -> success')
//             templates.push(doc)
//         } catch (e) {
//             console.log('Templates: loading template: ', template, ' -> failed')
//         }
//     }
//     return templates;
// }

module.exports = Template