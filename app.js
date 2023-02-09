require('dotenv').config()
const log = require('./libs/log')
const figlet = require('figlet');
const chalk = require('chalk')
console.log('-----------------------------------')
console.log(
    figlet.textSync('HASH', { horizontalLayout: 'full' })
)
console.log(' HTTP Agnostic Software Honeypot ')
console.log('-----------------------------------')
log('App', 'Starting HASH ')
// Init datadog tracer.
require('dd-trace').init({
    appsec: true,
    logInjection: true  
}); 
 
 

let appName = 'default'; //default app
//overwrite by environment variable or the cli 

appName = process.env.APP_NAME ||  process.argv.slice(2)[0]
const app = require('./libs/app')(__dirname, appName)

const config = require('./libs/config')(app.initFile)
const http = require('./libs/init')(config);

const { Cache } = require('./libs/randomizer')
Cache.reset();

//loading templates
const Template = require('./libs/template');

const template = new Template(app);
const { templates, dynamicTemplates } = template.load()

//simulate
const Simulator = require('./libs/simulator')
const simulator = new Simulator(app, http, templates, dynamicTemplates)
simulator.apply(config)

//overwrite express error handler
http.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(200).send('!!')
});

//default endpoint
http.get('/', (req,res) => {
    res.render('index')
})
 

http.listen(config.port, () => {
    log('App',`${app.name} listening on port ${config.port}`)
})
