const express = require('express');
const mustacheExpress = require('mustache-express');
const crypto = require('crypto');

const { faker } = require('./randomizer');

module.exports = (app) => {
    app.logger.info('Init -> Starting the server config');

    const exp = express();

    //generate an app key
    //const randomAppKey = crypto.createHash('md5').update(text).digest('hex')

    const randomAppKey = crypto.randomBytes(32).toString('hex');

    app.logger.info(
        'Init -> Configuring required middlewares (sessions, bodyparser)'
    );

    if (
        app.config.disableBuiltIn &&
        app.config.disableBuiltIn.includes('cookies')
    ) {
        app.logger.info(
            'Init',
            'Config: Disable cookies -> Skipping session & cookies management'
        );
        //simulating session for one request period
        exp.use(function (req, res, next) {
            req.session = {};
            next();
        });
    } else {
        const session = require('express-session');
        const cookieParser = require('cookie-parser');
        app.logger.info('Init -> Add session cookies');
        //configure session
        exp.set('trust proxy', 1); // trust first proxy
        exp.use(
            session({
                secret: process.env.APP_KEY || crypto.randomUUID(),
                resave: false,
                saveUninitialized: true,
                name: faker.internet.domainWord(),
                //cookie: { secure: true } //production only ssl
            })
        );
        exp.use(cookieParser());
    }

    exp.use(express.json()); // for parsing application/json
    exp.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

    app.logger.info('Init -> Configure datadog logger');
    const middlewareLogger = function (req, res, next) {
        exp.logger = (id, title, info) => {
            app.logger.warn(
                'HASH: ' + req.method + ' ' + req.originalUrl + ': ' + title,
                {
                    type: 'malicious',
                    templateId: id,
                    info,
                    http: {
                        client_ip: req.ip,
                        host: req.headers.host,
                        method: req.method,
                        path: req.path,
                    },
                    request: {
                        query: req.query || {},
                        params: req.params || {},
                        body: req.body || {},
                        headers: {
                            ...req.headers,
                            ...{
                                cookie_parsed: req.cookies,
                            },
                        },
                    },
                }
            );
        };
        next();
    };

    exp.use(middlewareLogger);

    app.logger.info('Init -> Configure template engine');
    exp.engine('mustache', mustacheExpress());

    exp.set('view engine', 'mustache');
    exp.set('views', __dirname + '/../views');

    //remove signature
    exp.disable('x-powered-by');
    exp.disable('etag');

    if (app.config.headers && Object.keys(app.config.headers).length > 0) {
        app.logger.info(
            'Init -> Expose global headers ' +
                JSON.stringify(app.config.headers)
        );
        //add global headers if any
        exp.use(function (req, res, next) {
            for (const header in app.config.headers) {
                res.setHeader(header, app.config.headers[header]);
            }
            next();
        });
    }

    return exp;
};
