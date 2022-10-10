const fs = require('fs')
const yaml = require('js-yaml');


/**
 * 
 * @param {string} dir 
 * @returns 
 */
const load = (dir) => {
    console.log('Templates: loading request templates')
    const dirents = fs.readdirSync(dir, { withFileTypes: true });
    const filesNames = dirents
    .filter(dirent => dirent.isFile())
    .map(dirent => dirent.name);

    let templates = [];
    for (let index = 0; index < filesNames.length; index++) {
        const template = filesNames[index];
        
        try {
            doc = yaml.load(fs.readFileSync(dir + '/' + template, 'utf8'));
            console.log('Templates: loading template: ', template, ' -> success')
            templates.push(doc)
        } catch (e) {
            console.log('Templates: loading template: ', template, ' -> failed')
        }
    }
    return templates;
}

module.exports.load = load;