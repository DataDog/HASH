'use strict';

const run = require('./cli/run')
const generate = require('./cli/generate')

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

program.command('generate')
    .description('generate default template')
    .argument('<folder>', 'path/to the app')
    .option('-t --template <template_name>', 'base template', 'default')
    .option('-n --name <honeypot_name>', 'Honeypot name')
    .option('-s --swagger <swagger_file>', 'Path to swagger file to convert')
    .action(async (appFolder, options) => {
        await generate(appFolder, options)
    });

program.parse();
