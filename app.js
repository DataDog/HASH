require('dotenv').config()
const figlet = require('figlet');
console.log('-----------------------------------')
console.log(
    figlet.textSync('HASH', { horizontalLayout: 'full' })
)
// console.log(
//     figlet.textSync('Honeypot Framework', { horizontalLayout: 'full' })
// )
console.log('-----------------------------------')

// Init datadog tracer.
require('dd-trace').init({
    appsec: true,
    logInjection: true  
});

//TODO: validate app
const appName = process.env.DD_HASH_APP ||  process.argv.slice(2)[0]
const app = require('./libs/app')(__dirname, appName)

const config = require('./libs/config')(app.initFile)
const http = require('./libs/init')(config);


//loading templates
const Template = require('./libs/template');

const template = new Template(app);
const templates = template.load()

 

//simulate
console.log(app)
const Simulator = require('./libs/simulator')
const simulator = new Simulator(app, http, templates)
simulator.apply()

//default endpoint
http.get('/', (req,res) => {
    res.render('index')
})


http.listen(config.port, () => {
    console.log(`${app.name} listening on port ${config.port}`)
})
