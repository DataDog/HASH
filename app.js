// Init datadog tracer.
require('dd-trace').init({
    appsec: true,
    logInjection: true
});

//TODO: validate app
const app = require('./libs/app')(__dirname, process.argv.slice(2))

//loading dotenv config
require('dotenv').config()
const config = require('./libs/config')(app.initFile)
const http = require('./libs/init')(config);


//loading templates
const templates = require('./libs/templates').load(app.templatesDir);

//simulate
const simulator = require('./libs/simulator')
simulator.apply(http, templates)

//default endpoint
http.get('/', (req,res) => {
    res.render('index')
})


http.listen(config.port, () => {
    console.log(`${app.name} listening on port ${config.port}`)
})
