const fs = require('fs')
module.exports = (basedir, name) => {
    const appDir = basedir + '/apps/' + name;
    const initFile = appDir + '/init.yaml';
    const templatesDir = appDir + '/templates';
    const resourcesDir = templatesDir + '/resources';

    //check if the directory is available 
    if (!fs.existsSync(appDir)) { console.log("Error: Directory: `"+appDir+"` not exists"); process.exit(1); }
    if (!fs.existsSync(initFile)) { console.log("Error: Init file: `"+initFile+"` not exists"); process.exit(1); }
    if (!fs.existsSync(templatesDir)) { console.log("Error: Template directory: `"+appDir+"` not exists"); process.exit(1); }
    if (!fs.existsSync(resourcesDir)) { console.log("Error: Template Resources directory: `"+appDir+"` not exists"); process.exit(1); }
    
    return {
        name,
        initFile,
        templatesDir,
        resourcesDir
    }
}


