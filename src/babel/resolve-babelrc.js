import path from 'path';

export default () => {
  return path.join(process.cwd(), '.babelrc');
}
