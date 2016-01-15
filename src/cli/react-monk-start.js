import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

import program from 'commander';

import normalizeDir from '../utils/normalize-dir';
import resolveBabelrc from '../babel/resolve-babelrc';
import { createTemporaryBabelrc, removeTemporaryBabelrc } from './babel/tmp-babelrc';


program
  .description('Start a node server with hot reloading and restart on crash')
  .usage('[options] <src>')
  .option('-w --watch', 'watch and continuously publish')
  .option('-o --out-dir <dir>', 'specify output directory (default: ./lib)', normalizeDir, normalizeDir('./lib'))
  .option('--source-maps [type]', 'compile with source maps')
  .option('--no-copy-files', 'When compiling a directory copy over non-compilable files')
  .parse(process.argv);


if(!program.args.length) {
  program.help();
}

const src = program.args[0];

/**
 * Compile using babel
 */
const babelExec = require.resolve('babel-cli/bin/babel');
let babelArgs = [src, '--out-dir', program.outDir]

if (program.watch) {
  babelArgs = babelArgs.concat('--watch');
}

if (program.sourceMaps) {
  babelArgs = babelArgs.concat('--source-maps');
  // source map has associated value
  if (program.sourceMaps !== true) {
    babelArgs = babelArgs.concat(program.sourceMaps);
  }
}

if (program.copyFiles) {
  babelArgs = babelArgs.concat('--copy-files');
}

// Generate a temporary babelrc
const reactMonkBabelrc = createTemporaryBabelrc(resolveBabelrc());
babelArgs = babelArgs.concat([
  '--extends', reactMonkBabelrc,
]);

const babelProc = spawn(babelExec, babelArgs, {
  cwd: process.cwd(),
  stdio: 'inherit',
});

babelProc.on('exit', (code, signal) => {
  removeTemporaryBabelrc(reactMonkBabelrc);
  process.on('exit', function(){
    if (signal) {
      process.kill(process.pid, signal);
    } else {
      process.exit(code);
    }
  });
});

// terminate children.
process.on('SIGINT', function () {
  babelProc.kill('SIGINT'); // calls babelProc.abort()
  babelProc.kill('SIGTERM'); // if that didn't work, we're probably in an infinite loop, so make it die.
});
