#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

import program from 'commander';

import normalizeDir from './utils/normalize-dir';


program
  .description('process source code for npm publishing')
  .usage('[options] <src>')
  .option('-w --watch', 'watch and continuously publish', false)
  .option('-o --out-dir <dir>', 'specify output directory (default: ./lib)', normalizeDir, normalizeDir('./lib'))
  .option('--source-maps [type]', 'compile with source maps', false)
  .parse(process.argv);


if(!program.args.length) {
  program.help();
}

// copy javascript files and css files
// Execute `babel $SRC --out-dir $OUT_DIR --watch`
// then copy all css files

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

// Add local presets and plugins
babelArgs = babelArgs.concat([
  '--presets',
  [
    require.resolve('babel-preset-es2015'),
    require.resolve('babel-preset-react'),
  ].join(','),
]);

spawn(babelExec, babelArgs);

/**
 * TODO copy stylesheets
 * I did not give a thought on how to distribute stylesheets yet.
 */
console.log('Stylesheets are not processed yet');
