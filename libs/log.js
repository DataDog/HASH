const winston = require('winston');
const path = require('path');

const MAX_FILE_SIZE = 1000000;
const MAX_FILES = 100;

module.exports.newLogger = (config) => {
    let tracer = null; //init status in case of datadog is not enabled
    const availableTransports = {
        console: () => {
            return new winston.transports.Console({
                format: winston.format.combine(
                    winston.format.colorize(),
                    winston.format.simple()
                ),
            });
        },
        file: () => {
            if (!config.options.log_file) {
                config.options.log_file = path.resolve(
                    process.cwd(),
                    'hash.log'
                );
            }
            return new winston.transports.File({
                tailable: true,
                filename: config.options.log_file,
                maxsize: MAX_FILE_SIZE,
                maxFiles: MAX_FILES,
            });
        },
        datadog: () => {
            const datadogServiceName =
                process.env.DD_SERVICE_NAME ||
                config.name ||
                'hash-default-service';
            const datadogApiKey = process.env.DD_API_KEY;

            if (!datadogApiKey) {
                console.error(
                    "Missing Datadog API key - specify DD_API_KEY to activate the 'datadog' log transport"
                );
                return false;
            }

            tracer = require('dd-trace').init({
                appsec: true,
                logInjection: true,
                service: datadogServiceName,
            });

            tracer.use('express', {
                // hook will be executed right before the request span is finished
                hooks: {
                  request: (span, req, res) => {
                    span.setTag("http.body", req.body)
                    span.setTag("http.query", req.query)
                    span.setTag("http.full_headers", req.headers)
                  }
                }
            })

            const params = new URLSearchParams({
                "dd-api-key": datadogApiKey,
                "ddsource": "nodejs",
                "service": datadogServiceName,
            })
            const path = `/api/v2/logs?${params.toString()}`

            return new winston.transports.Http({
                host: 'http-intake.logs.datadoghq.com',
                path,
                ssl: true,
            });
        },
    };

    const logger = winston.createLogger({
        level: 'info',
        exitOnError: false,
        format: winston.format.json(),
    });

    //parse the logs transports
    let transports = config.options.log
        ? config.options.log.split(',')
        : ['console']; //default is console

    for (const transport of transports) {
        if (availableTransports[transport]) {
            let logTransport = availableTransports[transport]();
            if (logTransport) {
                logger.add(logTransport);
                logger.info('Log -> Enable log transport:  ' + transport);
            } else {
                logger.error('Error enabling log transport: ' + transport);
            }
        } else {
            throw new Error(
                'Log -> log transport "' + transport + '" not found.'
            );
        }
    }
    return { logger, tracer };
};
