import path from 'path';

/**
 * normalize directory to have a full path
 */
const normalizeDir = (dirPath) => {
  return path.resolve(process.cwd(), dirPath);
};

export default normalizeDir;
