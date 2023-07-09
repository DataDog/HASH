'use strict';

const run = require('./run')

// const figlet = require('figlet');
// const chalk = require('chalk');
// console.log('-----------------------------------');
// console.log(figlet.textSync('HASH', { horizontalLayout: 'full' }));
// console.log(' HTTP Agnostic Software Honeypot ');
// console.log('-----------------------------------');

//setup the cli
//hash ./laravel
const { Command } = require('commander');
const program = new Command();
program
  .name('HASH')
  .description('HTTP Agnostic Software Honeypot')
  .version('1.0.0');

program.command('run')
    .description('Run HASH')
    .argument('<folder>', 'path/to the template folder')
    .option('-l, --log <transport>', 'logging transport', 'console,file,datadog')
    .option('-f, --log_file <filename>', 'logging filename', 'hash.log')
    .action((appFolder, options) => {
        run(appFolder, options)
    });

program.parse();
