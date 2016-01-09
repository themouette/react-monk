/**
 * Add superpowers to your webpack configuration.
 *
 * Helper to generate webpack configuration for react component.
 */
import fs from 'fs';
import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

import loadBabelConfig from '../babel/load-config';
import resolveBabelrc from '../babel/resolve-babelrc';


const loaderMatchExtension = (extension) => (loader) => {
  return loader.test.test(`a.${extension}`);
};
const loaderMatchOneOfExtensions = (extensions) => (loader) => {
  return extensions
    .reduce((acc, extension) => {
      if (acc) return acc;
      return loaderMatchExtension(extension)(loader);
    }, false);
};

/**
 * Prepend babel-loader to existing loaders for JS files
 *
 * @param {Array|String} loaders existing loaders (sass?xxx!autoprefixer)
 * @param String  loader  the loader to prepend
 * @param String  options optional options for loader
 *
 * @return Array
 */
const prependLoader = (loaders, loader, options) => {
  let newLoaders = [];
  let createdLoader = loader;

  if (loaders && typeof(loaders) === 'string') {
    newLoaders = newLoaders.concat(loaders.split('!'));
  } else if (loaders) {
      newLoaders = newLoaders.concat(loaders);
  } else {
    newLoaders = [];
  }

  if (options) {
    createdLoader = createdLoader + '?' + options;
  }

  newLoaders = [createdLoader].concat(newLoaders);

  return newLoaders;
}

/**
 * Upgrade config object.
 *
 * See the function body for available options.
 *
 * @param Object  param   webpack configuration object.
 * @return Object
 */
const generateConfig = (params = {}) => {
  const __DEV__ = process.env.NODE_ENV !== 'production';
  const __SERVER__ = params.target === 'node';
  const __BROWSER__ = !__SERVER__;

  const devtool = __SERVER__
    ? '#source-map'
    : __DEV__ ? '#cheap-eval-source-map' : false;

  let loaderBabel;
  let stylesheetLoaders;

  const options = {
    babelrc: resolveBabelrc(),
    plugins: [],
    devtool,
    debug: __DEV__,
    cache: false,
    hmr: false,
    catchErrors: false,
    visualizer: false,
    generateHtml: false,
    ignoreNodeModules: __SERVER__,
    resolveLoader: {
      modulesDirectories: [
				'web_loaders', 'web_modules', 'node_loaders', 'node_modules',
        // Allow to load react-monk loaders
        path.resolve(__dirname, '..', '..', 'node_modules'),
      ],
    },
    ...(params || {}),
  };

  /**
   * Ensure module.loaders are copies
   */
  if (!options.module) {
    options.module = {};
  } else {
    options.module = {...options.module};
  }
  if (!options.module.loaders) {
    options.module.loaders = [];
  } else {
    options.module.loaders = options.module.loaders
      .map(loader => ({ ...loader })); // make a copy to prevent modification
  }

  /**
   * output.libraryTarget should be 'commonjs' in node
   */
  if (__SERVER__ && options.output && ! options.output.libraryTarget) {
    options.output = {
      ...options.output,
      libraryTarget: 'commonjs',
    };
  }

  /**
   * Retrieve or add json loader
   */
  if (!options.module.loaders.filter(loaderMatchExtension('json')).length) {
    options.module.loaders.push({
      test: /\.json$/,
      loader: 'json-loader',
    });
  }

  /**
   * Retrieve and prepare javascript loader
   */
  loaderBabel = options.module.loaders.filter(loaderMatchExtension('js'))[0];
  if (!loaderBabel) {
    loaderBabel = {
      test: /\.js$/,
      exclude: /node_modules/,
    };
    options.module.loaders.push(loaderBabel);
  }


  /**
   * @param String babelrc the path to .babelrc
   */
  if (options.babelrc) {
    loaderBabel.query = loadBabelConfig(options.babelrc);
  }
  delete options.babelrc;

  /**
   * Prepare transformers configuration
   */
  var useReactTransform = options.hmr
      || options.catchError
      || options.visualizer;

  if (useReactTransform) {
    // Provide a namespace for react-transform configuration
    loaderBabel.query['react-transform'] =
      loaderBabel.query['react-transform'] || { transforms: [] };
  }

  /**
   * @param Bool hmr  activate Hot Modules Reload
   *
   * Use https://github.com/gaearon/react-transform-hmr
   */
  if (useReactTransform && options.hmr) {
    loaderBabel.query['react-transform'].transforms.push({
      'transform': 'react-transform-hmr',
      'imports': ['react'],
      'locals': ['module'],
    });
  }
  delete options.hmr;

  /**
   * @param Bool catchErrors  activate Hot Modules Reload
   *
   * Use https://github.com/gaearon/react-transform-catch-errors
   */
  if (useReactTransform && options.catchErrors) {
    loaderBabel.query['react-transform'].transforms.push({
      'transform': 'react-transform-catch-errors',
      'imports': ['react', 'redbox-react'],
    });
  }
  delete options.catchErrors;

  /**
   * @param Bool visualizer  activate Hot Modules Reload
   *
   * Use https://github.com/gaearon/react-transform-catch-errors
   */
  if (useReactTransform && options.visualizer) {
    loaderBabel.query['react-transform'].transforms.push({
      'transform': 'react-transform-render-visualizer',
    });
  }
  delete options.visualizer;

  // Append react transform plugin
  if (useReactTransform) {
    loaderBabel.query.plugins.push([
      'babel-plugin-react-transform',
      loaderBabel.query['react-transform']
    ]);
    delete loaderBabel.query['react-transform'];
  }

  /**
   * Ensure we use `loaders` and not loader.
   */
  if (loaderBabel.loader && !loaderBabel.loaders) {
    loaderBabel.loaders = loaderBabel.loader;
  }
  delete loaderBabel.loader;

  /**
   * Prepend configured babel loader
   */
  loaderBabel.loaders = prependLoader(
    loaderBabel.loaders,
    'babel-loader',
    JSON.stringify(loaderBabel.query)
  );
  delete loaderBabel.query;


  /**
   * Retrieve and prepare stylesheet loader
   */
  stylesheetLoaders = options
    .module
    .loaders
    .filter(loaderMatchOneOfExtensions(['css', 'scss', 'sass', 'less', 'stylus']));
  if (!stylesheetLoaders.length) {
    stylesheetLoaders = [{
      test: /\.css$/,
      loaders: []
    }];
    options.module.loaders = stylesheetLoaders.concat(options.module.loaders);
  }

  /**
   * Prepend configured css modules loader
   */
  stylesheetLoaders.forEach((loader) => {
    /**
    * Ensure we use `loaders` and not loader.
    */
    if (loader.loader && !loader.loaders) {
      loader.loaders = loader.loader;
    }
    delete loader.loader;
    loader.loaders = prependLoader(
      loader.loaders,
      'autoprefixer-loader',
      'browsers=last 2 version'
    );
    loader.loaders = prependLoader(
      loader.loaders,
      // on the server, transform css into JSON
      __SERVER__ ? 'css/locals' : 'css-loader',
      'modules&localIdentName=[name]__[local]___[hash:base64:5]&importLoaders=2&sourceMap'
    );
    if (__BROWSER__) {
      if (__DEV__) {
        loader.loaders = prependLoader(
          loader.loaders,
          'style-loader'
        );
      } else {
        // In production mode, extract css into its own file
        loader.loader = ExtractTextPlugin.extract('style-loader', loader.loaders.join('!'));
        delete loader.loaders;

        options.plugins.unshift(
          new ExtractTextPlugin('[name].css', {allChunks: true})
        );
      }
    }
  });


  /**
   * Generate the final configuration object
   */
  var ret = {
    module: {
      ...options.module
    },
    plugins: [],
  };
  delete options.module;

  /**
   * @param Boolean ignoreNodeModules do not include node_modules.
   *
   * Usualy used for server code, as node_modules are available at runtinme.
   */
  if (options.ignoreNodeModules) {
    const nodeModules = fs
      .readdirSync(path.join(process.cwd(), 'node_modules'))
      .filter(function isNotBin(x) { return x !== '.bin'; });
    ret.externals = []
      .concat(Array.isArray(options.externals) ? options.externals : [])
      .concat(nodeModules);
    delete options.externals;
  }
  delete options.ignoreNodeModules;

  /**
   * @param Object generateHtml configuration for HtmlWebpackPlugin (null to skip)
   */
  if (options.generateHtml) {
    ret.plugins = ret.plugins.concat([
      new HtmlWebpackPlugin(options.generateHtml)
    ]);
  }
  delete options.generateHtml;

  /**
   * @param Object plugins extra plugins
   */
  ret.plugins = ret.plugins.concat(options.plugins);
  delete options.plugins;

  /**
   * Merge all extra options with generated configuration.
   * Feel free to pass anything you want to webpack. If an option is not
   * forwarded, it might be a bug.
   */
  return {
    ...options,
    ...ret,
  };
};

export default generateConfig;
