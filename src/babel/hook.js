/**
 * Transform es6 with custom babel configuration
 */
import loadBabelConfig from './load-config';
import resolveBabelrc from './resolve-babelrc';

const babelConfig  = loadBabelConfig(resolveBabelrc());
require('babel-register')(babelConfig);
