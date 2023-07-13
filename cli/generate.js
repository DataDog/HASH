// const fs = require('fs')
const fs = require('fs-extra')
const path = require('path')
const SwaggerParser = require("@apidevtools/swagger-parser");
const yaml = require('js-yaml');

const TemplateDirectory = __dirname + '/../profiles/';

const generate = async(appFolder, options) => {

    let template = options.template;

    if(options.swagger){
        template = "empty" //overwrite the template
    }

    

    const availableTemplates = getAvailableTemplates();
    if(!availableTemplates.includes(template)){
        console.error("Template %s not exists, the available templates are (%s)", template, availableTemplates.join(', '))
    }

    if(!path.isAbsolute(appFolder)){
        appFolder = "./" + appFolder;
    }

    //check if exists
    if(fs.existsSync(appFolder)){
        console.error('Target folder: %s is already exists, please remove it or change the target folder', appFolder)
        process.exit(1);
    }

    console.log('Generating template. Target folder: %s', appFolder)
    fs.copySync(TemplateDirectory + template, appFolder)

    replaceTemplateContents(appFolder, options)



    if(options.swagger){
        //continue work on swagger
        await generateBasedOnSwagger(appFolder, options)
        process.exit(1);
    }

    console.log('soso')
    console.log(appFolder, options)
}


const replaceTemplateContents = (appFolder, options) => {
    let initContents = fs.readFileSync(appFolder + "/init.yaml", { encoding:"utf8"})

    initContents = initContents.replace("{%HoneypotName%}", options.name || "default-name");
    initContents = initContents.replace("{%DefaultHome%}", ""); //replace with empty string for now, TODO: add customization

    fs.writeFileSync(appFolder + "/init.yaml", initContents);
}




const generateBasedOnSwagger = async (appFolder, options) => {

    let swaggerFile = options.swagger;

    if(!path.isAbsolute(swaggerFile)){
        swaggerFile = "./" + swaggerFile;
    }


    if(!fs.existsSync(swaggerFile)){
        console.error('Swagger file %s is not exists', swaggerFile)
        process.exit(1)
    }

    try {
        let api = await SwaggerParser.validate(swaggerFile);
        console.log("API name: %s, Version: %s", api.info.title, api.info.version);

        //console.log('paths', api.paths)

        for (const path in api.paths) {
        
            const requests = api.paths[path];

            let pathJSON = generatePath(appFolder, path, requests)        
            let pathYAML = yaml.dump(pathJSON);

            fs.writeFileSync(appFolder + "/templates/" + pathJSON.id + '.yaml', pathYAML);

        }
      }
      catch(err) {
        console.error(err);
    }

}


const generateSlug = (path) => {
    let slug = path.replaceAll("/","-").replaceAll(/[{}]+/g, "")
    let randomNumericId = Math.round(Math.random() * 100000);
    return randomNumericId + slug;
}

const generatePath = (appFolder, path, requests) => {

    let slug = generateSlug(path)
    
    
    let pathObj = {
        id: slug,
        info: {
            title: path + " route"
        },
        requests: []
    }

    for (const method in requests) {
        const request = requests[method]; 

        let pathToRoute = path.replaceAll(/{([a-z0-9_-]+)}/g, ":$1") //this is to convert parameter from /{some}/ to the params which hash understand /:some/
        let DatafileName = slug + '-' + method+'.json';

        pathObj.requests.push({
            expect:{
                method: method.toUpperCase(),
                path: pathToRoute
            },
            reply:{
                status: Object.keys(request.responses)[0],
                headers:{
                    "content-type": "application/json"
                },
                body:{
                    view: DatafileName
                }
            }
        })      


        let res = buildResponse(request.responses[Object.keys(request.responses)[0]].schema, pathToRoute) //Currently support the first response
        fs.writeFileSync(appFolder + "/templates/resources/" + DatafileName, JSON.stringify(res, null, 2));

    }

    return pathObj;
}


const buildResponse = (schema, pathToRoute) => {

    // console.log("PTR", pathToRoute)
    
    if(schema.type == 'object'){
        let tmpRes = {};
        //build properties
        for (const propertyKey in schema.properties) {
            const propertyVal = schema.properties[propertyKey];
            if(propertyVal.type == 'object'){
                tmpRes[propertyKey] = buildResponse(propertyVal, pathToRoute)
            }else{
                tmpRes[propertyKey] = autoDiscoverRandomization(propertyKey, propertyVal.type, pathToRoute) //deal with different types
            }
        }
        return tmpRes;
    }

    if(schema.type == 'array'){
        let tmpRes = [];
        //randomize the number of the items
        let randomNum = Math.round(Math.random() * 10);
        for (let index = 0; index < randomNum; index++) {
            tmpRes.push(buildResponse(schema.items, pathToRoute))        
        }

        return tmpRes;
    }

}




const autoDiscoverRandomization = (keyName, type, pathToRoute) => {

    //if its used in the route parameter we should reflect this in the response
    if(pathToRoute.indexOf(":" + keyName) !== -1){
        return '{{ params.'+keyName+ ' }}'
    }


    //standaralize
    keyName = keyName.replaceAll(/[\s_-]+/g, '');
    keyName = keyName.toLocaleLowerCase();

    //now discover
    if(['name', 'firstname', 'lastname', 'fullname'].includes(keyName)){
        //its a name
        return "$<faker.name.firstName()>"
    }
    if(['sex', 'gender'].includes(keyName)){
        //its a name
        return "$<faker.name.sex()>"
    }
    if(['birthdate', 'date'].includes(keyName)){
        //its a name
        return "$<faker.date.past()>"
    }

    if(['address', 'street1', 'street2', 'address1', 'address2'].includes(keyName)){
        //its a name
        return "$<faker.address.streetAddress()>"
    }

    if(['city'].includes(keyName)){
        //its a name
        return "$<faker.address.city()>"
    }

    if(['postalcode', 'postal', 'zipcode', 'zip'].includes(keyName)){
        //its a name
        return "$<faker.address.zipCode()>"
    }

    //raturn random based on type
    if(type == 'string'){
        return '$<faker.random.word()>'
    }

    if(type == 'integer'){
        return '$<faker.random.numeric()>'
    }
}


const getAvailableTemplates = () => {
    return fs.readdirSync(TemplateDirectory);
}

module.exports = generate