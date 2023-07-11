const winston = require('winston');
const fs = require('fs')
const path = require('path')

module.exports.newLogger = (config) => {

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
                config.options.log_file = path.resolve(process.cwd(), 'hash.log')
            }
            return new winston.transports.File({
                filename: config.options.log_file,
            });

        },
        datadog: () => {
            const datadogServiceName =
                process.env.DD_SERVICE_NAME ||
                config.name ||
                'hash-deafult-service';
            const datadogApiKey = process.env.DD_API_KEY;
    
            if (!datadogApiKey) {
                console.error('Missing Datadog API key - specify DD_API_KEY to activate the \'datadog\' log transport')
                return false;
            }
    
            require('dd-trace').init({
                appsec: true,
                logInjection: true,
                service: datadogServiceName,
            });
            return new winston.transports.Http({
                host: 'http-intake.logs.datadoghq.com',
                path:
                    '/api/v2/logs?dd-api-key=' +
                    process.env.DD_API_KEY +
                    '&ddsource=nodejs&service=' +
                    encodeURIComponent(datadogServiceName),
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
            if(logTransport){
                logger.add(logTransport);
                logger.info('Log -> Enable log transport:  ' + transport);
            }else{
                logger.error('Error enabling log transport: ' + transport);
            }
            
        } else {
            throw new Error('Log -> log transport "' + transport + '" not found.');
        }
    }
    return logger;
}