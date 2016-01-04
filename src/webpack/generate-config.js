/**
 * Add superpowers to your webpack configuration.
 *
 * Helper to generate webpack configuration for react component.
 */
import fs from 'fs';
import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';

import loadBabelConfig from '../babel/load-config';


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
  let createdLoader = require.resolve(loader);

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

  const devtool = __DEV__
    ? 'cheap-eval-source-map'
    : __SERVER__ ? 'source-map' : false;

  let loaderBabel;
  let stylesheetLoaders;

  const options = {
    babelrc: path.join(process.cwd(), '.babelrc'),
    plugins: [],
    devtool,
    hmr: false,
    catchErrors: false,
    visualizer: false,
    generateHtml: false,
    ...(params || {}),
  };

  /**
   * @param Array loaders  shortcut to `module: { loaders: [] }`
   *
   * Used to store modules for temporary processing.
   */
  if (!options.module) {
    options.module = {};
  }
  if (!options.module.loaders) {
    options.module.loaders = [];
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
      'transform': require.resolve('react-transform-hmr'),
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
      'transform': require.resolve('react-transform-catch-errors'),
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
      'transform': require.resolve('react-transform-render-visualizer'),
    });
  }
  delete options.visualizer;

  // Append react transform plugin
  if (useReactTransform) {
    loaderBabel.query.plugins.push([
      require.resolve('babel-plugin-react-transform'),
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
      'css-loader',
      'modules&localIdentName=[name]__[local]___[hash:base64:5]&importLoaders=2&sourceMap'
    );
    loader.loaders = prependLoader(loader.loaders, 'style-loader');
  });


  /**
   * Prepend css modules transformers
   */


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
