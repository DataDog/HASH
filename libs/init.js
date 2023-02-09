const log = require('./log')
const express = require('express')
const mustacheExpress = require('mustache-express');  

const { createLogger, format, transports } = require('winston');
const { faker } = require('./randomizer')

module.exports = (config) => {
    log('Init', 'Starting the server config')

    const app = express()

    log('Init', 'Configuring required middlewares (sessions, bodyparser)')


    if(config.disableBuiltIn && config.disableBuiltIn.includes('cookies')){
        log('Init', 'Config: Disable cookies -> Skipping session & cookies management')
        //simulating session for one request period
        app.use(function(req, res, next) {
            req.session = {}
            next()   
        })
    }else{
        const session = require('express-session')
        const cookieParser = require('cookie-parser')
        log('Init', 'Add session cookies')
        //configure session
        app.set('trust proxy', 1) // trust first proxy
        app.use(session({
            secret: process.env.APP_KEY,
            resave: false,
            saveUninitialized: true,
            name: faker.internet.domainWord(),
            //cookie: { secure: true } //production only ssl
        }))
        app.use(cookieParser())
    }

    

    app.use(express.json()) // for parsing application/json
    app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
    

    log('Init', 'Configure datadog logger')
    //configure logger
    const httpTransportOptions = {
        host: 'http-intake.logs.datadoghq.com',
        path: '/api/v2/logs?dd-api-key='+process.env.DD_API_KEY+'&ddsource=nodejs&service='+process.env.DD_SERVICE,
        ssl: true
    };
    
    const logger = createLogger({
        level: 'info',
        exitOnError: false,
        format: format.json(),
        transports: [
            new transports.Http(httpTransportOptions),
        ],
    });

    const datadogLogger = function (req, res, next) {
        app.logger = (id, title, info) => {
            logger.info('APPSEC HONEYPOT:' + title,{
                templateId: id,
                info,
                request:{
                    path:  req.path,
                    method: req.method,                
                    query: req.query,
                    params: req.params,
                    body: req.body,
                    cookies: req.cookies,
                    ip: req.ip
                }
            });
        }
        next()
    }
    
    app.use(datadogLogger); 


    

    log('Init', 'Configure template engine')
    app.engine('mustache', mustacheExpress());


    app.set('view engine', 'mustache');
    app.set('views', __dirname + '/../views');

    //remove signature
    app.disable('x-powered-by');
    app.disable('etag');

    log('Init', 'Expose global headers' + JSON.stringify(config.headers))
    //add global headers if any
    app.use(function(req, res, next) {
        for (const header in config.headers) {
            res.setHeader(header, config.headers[header])
        }
        next();
    });


    return app;
}