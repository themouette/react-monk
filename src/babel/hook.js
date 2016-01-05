import path from 'path';

import hook from 'css-modules-require-hook';

import loadBabelConfig from './load-config';
import resolveBabelrc from './babel/resolve-babelrc';

/**
 * Transform es6 with custom babel configuration
 */
const babelConfig  = loadBabelConfig(resolveBabelrc());
require('babel-register')(babelConfig);

/**
 * Allow css modules to be required
 */
hook({
  generateScopedName: function(exportedName, path) {
    return exportedName;
  }
});
