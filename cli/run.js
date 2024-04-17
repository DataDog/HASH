const figlet = require('figlet');
const { newApp } = require('../libs/app');
const { newLogger } = require('../libs/log');

const run = (appFolder, options) => {
    //validate the folder first
    const app = newApp(appFolder);

    console.log('-----------------------------------');
    console.log(figlet.textSync('HASH', { horizontalLayout: 'full' }));
    console.log(' HTTP Agnostic Software Honeypot ');
    console.log('-----------------------------------');

    const config = require('../libs/config')(app);
    app.config = config;
    app.config.options = options; //add the cli options to config

    const log = newLogger(app.config);
    app.logger = log.logger
    app.tracer = log.tracer

    app.logger.info('App -> Starting HASH ');

    const http = require('../libs/init')(app);

    const { Cache } = require('../libs/randomizer');
    Cache.reset();

    //reset cache every 10 min (1000 * 60 * 10)
    setInterval(() => {
        Cache.reset();
    }, 600000);

    //loading templates
    const Template = require('../libs/template');

    const template = new Template(app);
    const { templates, dynamicTemplates } = template.load();

    //simulate
    const Simulator = require('../libs/simulator');
    const simulator = new Simulator(app, http, templates, dynamicTemplates);
    simulator.apply();

    //overwrite express error handler
    http.use((err, req, res, next) => {
        app.logger.error('HTTP -> 500 error: ' + err.message, {
            stack: err.stack,
        });
        res.status(200).send('!!');
    });

    //default endpoint
    http.get('/', (req, res) => {
        res.send('Hello, World');
    });

    http.listen(config.port, () => {
        app.logger.info(`App -> listening on port ${config.port}`);
    });
};

module.exports = run;
