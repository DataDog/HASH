require('dotenv').config()
const logger = require('./libs/log');

const figlet = require('figlet');
const chalk = require('chalk')
console.log('-----------------------------------')
console.log(
    figlet.textSync('HASH', { horizontalLayout: 'full' })
)
console.log(' HTTP Agnostic Software Honeypot ')
console.log('-----------------------------------')
logger.info('App -> Starting HASH ')
 
let appName = 'default'; //default app
//overwrite by environment variable or the cli 

appName = process.env.APP_NAME ||  process.argv.slice(2)[0]
logger.info('App -> Loading Application: ' + appName)
const app = require('./libs/app')(__dirname, appName)
app.logger = logger;

const config = require('./libs/config')(app);
app.config = config;

const http = require('./libs/init')(app);

const { Cache } = require('./libs/randomizer');
Cache.reset();

//reset cache every 10 min (1000 * 60 * 10)
setInterval(() => {
    Cache.reset();
}, 600000);


//loading templates
const Template = require('./libs/template');

const template = new Template(app);
const { templates, dynamicTemplates } = template.load();

//simulate  
const Simulator = require('./libs/simulator');
const simulator = new Simulator(app, http, templates, dynamicTemplates);
simulator.apply()

//overwrite express error handler
http.use((err, req, res, next) => {
    logger.error('HTTP -> 500 error: ' + err.message, {stack: err.stack});
    res.status(200).send('!!');
});

//default endpoint
http.get('/', (req,res) => {
    res.send('Hello, World');
})


http.listen(config.port, () => {
    logger.info(`App -> ${app.name} listening on port ${config.port}`);
})
