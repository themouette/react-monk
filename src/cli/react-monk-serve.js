import path from 'path';

import program from 'commander';

import normalizeDir from '../utils/normalize-dir';
import reactMonk from '../index';


program
  .description('build a react component into a single script file')
  .usage('[options] <entrypoint>')
  .option('--port <port>', 'port for serving the application', (x) => parseInt(x), 1337)
  .option('--host <host>', 'port for serving the application', '0.0.0.0')
  .option('--no-hmr', 'enable hot module replacement', false)
  .option('--catch-errors', 'enable error catching (requires redbox-react)', false)
  .option('--visualizer', 'enable render props visualizer', false)
  .option('--html [title]', 'generate an index.html file', true)
  .option('--no-html', 'generate an index.html file')
  .option('-v --verbose', 'log webpack config')
  .option('--no-colors', 'deactivate colors', false)
  .option('--public-path <path>', 'public path on which application is exposed')
  .option('--content-base <path>', 'webpack-dev-server --content-base option', normalizeDir)
  .option('--history-api-fallback <path>', 'webpack-dev-server option', false)
  .option('--webpack <config_file>', 'extends given config file', normalizeDir)
  .option('--proxy <backendurl>', 'http url of service to proxify')
  .parse(process.argv);

if(!program.args.length) {
  program.help();
}

if (!program.contentBase && !program.publicPath) {
  program.contentBase = process.cwd();
  program.publicPath = '/'
}
if (!program.contentBase) {
  program.contentBase = path.join(process.cwd(), program.publicPath);
}
if (!program.publicPath) {
  program.publicPath = path.relative(program.contentBase, program.args[0]);
  program.publicPath = `/${program.publicPath}/`;
}

reactMonk.serve(
  program.args.map(normalizeDir), {
    ...(program.webpack ? require(program.webpack) : {}),
    contentBase: program.contentBase,
    host: program.host,
    port: program.port,
    publicPath: program.publicPath,
    proxy: program.proxy
      ? { '/': { target: program.proxy } }
      : program.proxy,
    historyApiFallback: program.historyApiFallback,
    https: false,
    colors: true,
    verbose: program.verbose,
    hmr: program.hmr,
    catchErrors: program.catchErrors,
    visualizer: program.visualizer,
    // Use argument as title
    generateHtml: program.html,
  });

