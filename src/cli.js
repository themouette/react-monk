#!/usr/bin/env node

import program from 'commander';

import pkg from '../package.json';

program
  .version(pkg.version)
  .description(pkg.description)
  .command('build <entry>', 'Build entry')
  .command('transform <dir>', 'Generate module code for npm consuming')
  .command('serve <entry>', 'Serve entry with hot reload')
  .command('test [files ...]', 'Launch mocha tests')
  .parse(process.argv);

if(!program.args.length) {
  program.help();
}

