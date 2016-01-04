import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

import program from 'commander';
import glob from 'glob';
import minimatch from 'minimatch';

import loadBabelConfig from './babel/load-config';

program
  .description('launch mocha tests in node')
  .usage('[options] [entrypoint]')
  .allowUnknownOption()
  .option('-w --watch', 'watch and continuously build entrypoint', false)
  .option('--coverage [reporter]', 'add code coverage')
  .option('--pattern <pattern>', 'test files pattern', '*-test.@(js|jsx)')
  .parse(process.argv);


if(!program.args.length) {
  program.args.push('src');
}


/* -------------------------------------------------------------------------- */

/**
 * process args to ensure files match pattern
 *
 * @param Array args  the cli arguments
 */
const extractFiles = (pattern, args) => {
  return args
    .map(function (fileOrDir) {
      var files;
      var fullpath = path.resolve(process.cwd(), fileOrDir);

      // If a directory is provided
      if (fs.existsSync(fullpath) && fs.lstatSync(fullpath).isDirectory()) {
        return [path.join(fullpath, '**', pattern)];
      }

      // All further cases willbe filtered against pattern
      // If a file is provided
      if (fs.existsSync(fullpath)) {
        files = [fileOrDir];
      }
      // Assume anything else is a pattern
      else {
        files = glob.sync(fileOrDir, {nodir: true});
      }

      return files.filter(minimatch.filter(pattern, {matchBase: true}));
    })
    .reduce(function (acc, current) {
      return acc.concat(current);
    }, [])
    .filter(function(str) {return str;})
    .sort();
}

const filesToProcess = extractFiles(program.pattern, program.args);
if (!filesToProcess || !filesToProcess.length) {
  throw new Error('No file matches pattern');
}

// Parse extra options using minimist
// I do not know how to do this with commander
const options = require('minimist')(program.rawArgs.slice(2));
const ignoredOptions = ['_', 'watch', 'w', 'coverage', 'pattern'];
const extraArgs = Object.keys(options)
  .filter((key) =>  ignoredOptions.indexOf(key) === -1)
  .reduce(function(acc, key) {
    const prefix = key.length === 1 ? '-' : '--';
    const value = prefix + key;
    if (typeof(options[key]) === 'boolean') {
      return acc.concat(value);
    }

    return acc.concat(value, options[key]);
  }, []);

if (program.watch) {
  extraArgs.push('--watch');
}

let command = [
    // Add a hook with babel configuration
    '--require', require.resolve('./babel/hook'),
    '--recursive',
  ]
  .concat(extraArgs)
  .concat(filesToProcess);

if (program.coverage) {
  command = [
    require.resolve('../node_modules/.bin/babel-istanbul'),
    'cover',
  ]
  // If a coverage report is provided, add --report option
  .concat(typeof(program.coverage) === 'string'
    ? ['--report', program.coverage]
    : []
  )
  .concat([
      require.resolve('mocha/bin/_mocha'),
    '--'
  ])
  .concat(command);
} else {
  command = [require.resolve('mocha/bin/_mocha')].concat(command);
}

/**
 * Spawn mocha command.
 */
var runner = spawn(process.execPath, command, { stdio: 'inherit' });

runner.on('exit', (code, signal) => {
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
  runner.kill('SIGINT'); // calls runner.abort()
  runner.kill('SIGTERM'); // if that didn't work, we're probably in an infinite loop, so make it die.
});
