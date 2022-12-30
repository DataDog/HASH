const chalk = require('chalk');

let log =  (module, message, level = 'log' ) => {
    if(process.env.Debug === false) return;
    let msg = "";
    if(level == 'log') msg += chalk.magenta('%s: ') + chalk.green('%s');
    if(level == 'warning') msg += chalk.magenta('%s: ') + chalk.yellow('%s: %s');
    if(level == 'error') msg += chalk.magenta('%s: ') + chalk.red('%s: %s');

    // msg += chalk.grey(module);
    console.log(msg, module, message)
}


module.exports = log;



// console.log(chalk.green('Hello %s'), "Koko WAWA");

// log('App','App started')
// log('App','App started started started')
// log('App','Appstartedstarted')
// log('App','App started started')
// log('App','App started')
// log('App','App started asd asdklaj asdLJAEO0823 DSFLKJ23 ')
// log('Template', 'Template parsing error', 'warning')
// log('Template', 'Template not found', 'error')
