// Init datadog tracer.
require('dd-trace').init({
    appsec: true,
    logInjection: true
});

//loading dotenv config
require('dotenv').config()
const config = require('./libs/config')(__dirname + '/init.yaml')
const app = require('./libs/init')(config);


//loading templates
const templates = require('./libs/templates').load(__dirname + '/templates');

//simulate
const simulator = require('./libs/simulator')
simulator.apply(app, templates)

//default endpoint
app.get('/', (req,res) => {
    res.render('index')
})


app.listen(config.port, () => {
    console.log(`Example app listening on port ${config.port}`)
})
