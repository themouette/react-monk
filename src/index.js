import path from 'path';

import _ from 'lodash';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';

import generateConfig from './webpack/generate-config';
import { buildStatOptions } from './webpack/log-build-stats';
import { addEntry, prependToAllWebpackEntries } from './webpack/entry'



/**
 * Add a new webpack plugin to the end of existing plugins
 *
 * @param Object  config  webpack config
 * @param {Array|Object}  newPlugin  new plugin(s) class to append
 * @param Boolean uniq  prevent the appending when an instance of the same plugin exists
 * @return Array
 */
const appendWebpackPlugin = (config, newPlugin, uniq = true) => {
  const plugins = config.plugins || [];
  // only append plugins that donot already exists
  const toAppend = []
    // ensures it is an array
    .concat(newPlugin || [])
    // remove the ones with existing instances
    .filter((plugin) => {
      if (!uniq) return plugin;
      return !_.some(
        plugins,
        (prevPlugin) => plugin.constructor === prevPlugin.constructor
      );
    })

  return plugins.concat(toAppend);
}

const parseGenerateHtmlOption = (config) => {
  let generateHtml = {};
  if (!config.generateHtml) return config.generateHtml;
  if (config.generateHtml === true) {
    generateHtml.title = 'react-monk';
  }
  if (typeof(config.generateHtml) === 'string') {
    generateHtml.title = config.generateHtml
  }
  if (typeof(config.generateHtml) === 'object') {
    generateHtml = {
      ...config.generateHtml,
    };
  }

  // Emulate the [name] parameter
  const canonicalName = Object.keys(config.entry)[0];
  return {
    title: 'react-monk',
    filename: `${canonicalName}.html`,
    ...generateHtml,
  };
};



export default {
  /**
   * Serve client code using WebpackDevServer.
   *
   * @param Object options  react monk options (accept any webpack option)
   */
  serve(filesParam, options = {}) {
    const {
      contentBase,
      host,
      port,
      publicPath,
      proxy,
      historyApiFallback,
      https,
      colors,
      verbose,
      ...webpackOptions,
    } = _.merge({
      contentBase: process.cwd(),
      host: '0.0.0.0',
      port: process.env.PORT || 1337,
      publicPath: '/',
      historyApiFallback: true,
      https: false,
      hmr: true,
      colors: true,
      verbose: false,
    }, options);

    const config = []
      .concat(filesParam || [])
      .map((file) => {
        const options = {
          ...webpackOptions,
          entry: addEntry(webpackOptions, file),
          output: {
            ...(webpackOptions.output || {}),
            path: contentBase,
            publicPath,
            filename: '[name].js',
          },
        };

        options.generateHtml = parseGenerateHtmlOption(options);

        if (options.hmr) {
          const scheme= https ? 'https' : 'http';
          const socketUrl = `?${scheme}://${host}:${port}`;
          // Install the Hot reload server scripts
          options.entry = prependToAllWebpackEntries(
            options, [
              require.resolve('webpack-dev-server/client/') + socketUrl,
              require.resolve('webpack/hot/dev-server'),
            ]
          );

          options.plugins = appendWebpackPlugin(
            options, [
              new webpack.HotModuleReplacementPlugin(),
              new webpack.NoErrorsPlugin()
            ]
          );
        }

        return options;
      })
      .map(generateConfig);

    const compiler = webpack(config);
    const server = new WebpackDevServer(compiler, {
      contentBase,
      publicPath,
      hot: options.hmr,
      historyApiFallback: historyApiFallback,
      stats: buildStatOptions({ colors, verbose }),
      headers: { 'Access-Control-Allow-Origin': '*' },
      proxy: proxy
        ? { '/': { target: proxy } }
        : proxy,
    });

    server.listen(port, host, (err) => {
      if (err) {
        console.log('Server error occured');
        return console.log(err);
      }
      console.log(`Listening on http://${host}:${port}`);
    });

    return server;
  },

  start(filename, options = {}) {
    const webpackOptions = options;
  },

  build() {
    const webpackOptions = options;
  }
};
