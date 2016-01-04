import fs from 'fs';

/**
 * Read .babelrc
 *
 * @param string  babelrc the babelrc file to use.
 * @return Object
 */
const loadBabelConfig = (babelrc) => {
  /**
   * Add a reference to local preset if not provided
   */
  const addIfMissing = (preset, presets) => {
    if (presets.indexOf(preset) >= 0) {
      return presets;
    }
    return [require.resolve(`babel-preset-${preset}`)].concat(presets);
  }
  let ret = {
    presets: [],
    plugins: [],
  };
  let babelrcContent;

  try {
    babelrcContent = fs.readFileSync(babelrc);
  } catch (e) {
    console.log('no .babelrc found');
    babelrcContent = '{}';
  }

  try {
    ret = {
      ...ret,
      ...JSON.parse(babelrcContent),
    };
  } catch(e) {
    throw new Error('Unable to parse .babelrc');
  }

  /* WARN anything you add here should be added in src/cli-publish.js as well */
  ret.presets = addIfMissing('es2015', ret.presets);
  ret.presets = addIfMissing('react', ret.presets);
  /* WARN anything you add here should be added in src/cli-publish.js as well */

  return ret;
}

export default loadBabelConfig;
