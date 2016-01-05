import fs from 'fs';
import path from 'path';

import loadBabelConfig from './load-config';

/**
 * Create a temporary babelrc file.
 *
 * Returns the path ro create babelrc
 *
 * @param String babelrc  the babelrc file to use
 * @return string
 */
export const createTemporaryBabelrc = (babelrc) => {
  const reactMonkBabelrc = path.join(process.cwd(), '.react-monk-babelrc');
  fs.writeFileSync(
    reactMonkBabelrc,
    JSON.stringify(loadBabelConfig(babelrc))
  );

  return reactMonkBabelrc;
}

/**
 * Remove temporary babelrc file
 *
 * @param String tmpBabelrc path to temporary babelrc
 */
export const removeTemporaryBabelrc = (tmpBabelrc) => {
  fs.unlinkSync(tmpBabelrc);
}

