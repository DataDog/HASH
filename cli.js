const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const inquirer = require('inquirer');
const CLI = require('clui');
const Spinner = CLI.Spinner;
const fs = require('fs')
//clear();

const modules = {
    "Apache": {
        "headers": {
            "Server":"Apache/2.4.19"
        }
    },
    "IIS": {
        "headers": {
            "Server": "Microsoft-IIS/7.0"
        }
    }
}

//what's the name for your honeypot (this is internal)
//what's should be called publicly (this is public)
//IP 
//Shoud we mimic a web-server (apache, nginx ...etc)
//Should we mimic a language (PHP, Nodejs, ..etc)
//Include sitemap
//Include robots.txt


console.log(
    chalk.red(
      figlet.textSync('HASH', { horizontalLayout: 'full' })
    )
);



const questions = [
    {
      name: 'id',
      type: 'input',
      message: 'Enter the name of the honeypot (this is internal):',
      validate: function( value ) {
        //check if the directory exists
        if(fs.existsSync(__dirname + '/apps/' + value)) {
            return 'Director is already exists, Choose different name'
        }        

        return true;
      }
    },
    {
      name: 'name',
      type: 'input',
      message: 'Enter the application name (this is PUBLIC):',
      validate: function(value) {
        if (value.indexOf('honeypot') !== -1){
            return 'This is the public name, you cant include honeypot in it'
        }
        return true;
      }
    },
    {
      name: 'port',
      type: 'input',
      message: 'Enter the port number:',
      validate: function(value) {
        //todo, validate port
        if(!value){
            return 'Please enter the port number:'
        }
        return true;
      }
    },
    {
        type: 'list',
        name: 'webserver',
        message: 'Should we simulate a specific webserver?',
        choices: [ 'Apache', 'Nginx', 'IIS', 'None' ],
        default: 'None'
    }
];




const run = async () => {
    const answers = await inquirer.prompt(questions);
    console.log(answers)

    let webserver = modules[answers.webserver];

    let defaultTemplate = {
        port:8080,
        headers: {
            "kotomoto": "ya helwa",
            "Server":"notMuch"
        }
    }

    defaultTemplate.port = answers.port
    defaultTemplate.headers = {...defaultTemplate.headers, ...webserver.headers}

    console.log(defaultTemplate)

    const status = new Spinner('Authenticating you, please wait...');
    status.start();
    setTimeout(async () => {
        status.stop()
        // const answers = await inquirer.prompt(questions2)
        // status.start();
        // console.log(answers)
        // setTimeout(()=> { status.stop() });
    },3000)
}


run()