const chalk = require('chalk');

let log =  (module, message, level = 'log' ) => {
    if(process.env.Debug === false) return;
    let msg = "";
    if(level == 'log') msg += chalk.magenta('%s: ') + chalk.green('%s');
    if(level == 'warning') msg += chalk.magenta('%s: ') + chalk.yellow('%s: %s');
    if(level == 'error') msg += chalk.magenta('%s: ') + chalk.red('%s: %s');

    console.log(msg, module, message)
}


module.exports = log;