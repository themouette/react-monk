import path from 'path';

import program from 'commander';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';

import generateConfig from './webpack/generate-config';
import { buildStatOptions } from './webpack/log-build-stats';
import logWebpackConfiguration from './webpack/log-configuration';
import normalizeDir from './utils/normalize-dir';


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

const configuration = program.args
  .map(normalizeDir)
  .map((entryfile) => {
    let entry = [entryfile];
    let plugins = [];

    if (program.hmr) {
      // Add the client scripts
      entry = [
        require.resolve('webpack-dev-server/client/')
          + '?http://' + program.host + ':' + program.port,
        require.resolve('webpack/hot/dev-server'),
        entryfile,
      ];
      plugins = plugins.concat([
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
      ]);
    }

    const canonicalName = path.basename(entryfile, '.js');
    return generateConfig({
      ...(program.webpack ? require(program.webpack) : {}),
      entry: {
        [canonicalName]: entry,
      },
      output: {
        path: program.contentBase,
        publicPath: program.publicPath,
        filename: '[name].js',
      },
      plugins,
      hmr: program.hmr,
      catchErrors: program.catchErrors,
      visualizer: program.visualizer,
      // Use argument as title
      generateHtml: !program.html
        ? program.html
        : {
          title: program.html === true ?  'react-monk' : program.html,
          filename: `${canonicalName}.html`,
        },
    });
  });

if (program.verbose) {
  logWebpackConfiguration(program)(configuration);
}

const compiler = webpack(configuration);
const server = new WebpackDevServer(compiler, {
  contentBase: program.contentBase,
  publicPath: program.publicPath,
  hot: program.hmr,
  inline: program.hmr,
  historyApiFallback: program.historyApiFallback,
  stats: buildStatOptions(program),
  headers: { 'Access-Control-Allow-Origin': '*' },
  proxy: program.proxy
    ? { '/': { target: program.proxy } }
    : program.proxy,
});

server.listen(program.port, program.host, (err) => {
  if (err) {
    console.log('Server error occured');
    return console.log(err);
  }
  console.log(`Listening on http://${program.host}:${program.port}`);
});
