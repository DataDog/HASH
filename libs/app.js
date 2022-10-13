const fs = require('fs')
module.exports = (basedir, argument) => {
    const name = argument[0];
    const appDir = basedir + '/apps/' + name;
    const initFile = appDir + '/init.yaml';
    const templatesDir = appDir + '/templates/';

    

    //check if the directory is available 
    if (!fs.existsSync(appDir)) { console.log("Error: Directory: `"+appDir+"` not exists"); process.exit(1); }
    if (!fs.existsSync(initFile)) { console.log("Error: Init file: `"+initFile+"` not exists"); process.exit(1); }
    if (!fs.existsSync(templatesDir)) { console.log("Error: Tempalte directory: `"+appDir+"` not exists"); process.exit(1); }

    console.log('Loading Application: ', name)
    
    return {
        name,
        initFile,
        templatesDir
    }
}


