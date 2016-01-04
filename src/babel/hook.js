import path from 'path';

import hook from 'css-modules-require-hook';

import loadBabelConfig from './load-config';

/**
 * Transform es6 with custom babel configuration
 */
const babelrc = path.join(process.cwd(), '.babelrc')
const babelConfig  = loadBabelConfig(babelrc);
require('babel-register')(babelConfig);

/**
 * Allow css modules to be required
 */
hook({
  generateScopedName: function(exportedName, path) {
    return exportedName;
  }
});
