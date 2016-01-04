import path from 'path';

import program from 'commander';
import webpack from 'webpack';

import generateConfig from './webpack/generate-config';
import logBuildStats from './webpack/log-build-stats';
import logWebpackConfiguration from './webpack/log-configuration';
import normalizeDir from './utils/normalize-dir';


program
  .description('build a react component into a single script file')
  .usage('[options] <entrypoint ...>')
  .option('-o --out-dir <dir>', 'specify output directory (default: ./dist)', normalizeDir, normalizeDir('./dist'))
  .option('-w --watch', 'watch and continuously build entrypoint', false)
  .option('--public-path <path>', 'public path on which application is exposed', '/')
  .option('--hmr', 'enable hot module replacement', false)
  .option('--catch-error', 'enable error catching (red box)', false)
  .option('--visualizer', 'enable render props visualizer', false)
  .option('--html [title]', 'generate an index.html file', false)
  .option('-v --verbose', 'log webpack config')
  .option('--no-colors', 'deactivate colors', false)
  .parse(process.argv);

if(!program.args.length) {
  program.help();
}


const configuration = program.args
  .map(normalizeDir)
  .map((entry) => generateConfig({
    entry,
    output: {
      path: program.outDir,
      publicPath: program.publicPath,
      filename: path.basename(entry),
    },
    hmr: program.hmr,
    catchErrors: program.catchErrors,
    visualizer: program.visualizer,
    // Use argument as title
    generateHtml: !program.html
      ? program.html
      : (
        program.html === true
          ? { title: 'react-monk' }
          : { title: program.html }
      ),
  }));

if (program.verbose) {
  logWebpackConfiguration(program)(configuration);
}

const compiler = webpack(configuration);
if (program.watch) {
  compiler.watch({}, logBuildStats(program));
} else {
  compiler.run(logBuildStats(program));
}
