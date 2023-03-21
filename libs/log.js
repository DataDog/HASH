//const chalk = require('chalk');

const winston = require('winston')
const availableTransports = {
    "console": () => {
        return new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        })
    },
    "file": () => {
        return new winston.transports.File({
            filename: process.env.LOG_FILE,
        });
    },
    "datadog" : () => {
        const datadogServiceName = process.env.DD_SERVICE_NAME || process.env.HONEYPOT_PROFILE || 'default';

        require('dd-trace').init({
            appsec: true,
            logInjection: true,
            service: datadogServiceName,
        }); 
        return new winston.transports.Http({
            host: 'http-intake.logs.datadoghq.com',
            path: '/api/v2/logs?dd-api-key='+process.env.DD_API_KEY+'&ddsource=nodejs&service='+encodeURIComponent(datadogServiceName),
            ssl: true
        })
    },
}

const logger = winston.createLogger({
    level: 'info',
    exitOnError: false,
    format: winston.format.json()
});


//parse the logs transports
let transports = process.env.LOG_TRANSPORTS ? process.env.LOG_TRANSPORTS.split(',') : [];

for (const transport of transports) {
    if(availableTransports[transport]){
        logger.add(availableTransports[transport]());
        logger.info('Log -> Enable log transport: ' + transport);
    }else{
        logger.error('Log -> log transport "' + transport + '" not found.');
        process.exit(1);
    }
}


module.exports = logger;