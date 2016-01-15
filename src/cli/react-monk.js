import program from 'commander';

import pkg from '../../package.json';

program
  .version(pkg.version)
  .description(pkg.description)
  .command('build <entry>', 'Build code (server or browser) for distribution')
  .command('start <entry>', 'Start node code with hot reload')
  .command('serve <entry>', 'Serve browser code with hot reload')
  .command('mocha [files ...]', 'Launch mocha tests')
  .parse(process.argv);

if(!program.args.length) {
  program.help();
}

