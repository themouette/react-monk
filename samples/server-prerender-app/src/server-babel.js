/**
 * Run server with on the fly css-modules compilation.
 */
import '../../../../react-monk/lib/css-modules/hook';

require('./server');

if (process.env.HOT_RELOAD) {
  // Do 'hot-reloading' of express stuff on the server
  // Throw away cached modules and re-require next time
  // Ensure there's no important state in there!
  // Taken from https://github.com/glenjamin/ultimate-hot-reloading-example
  // You sould condiser using piping instead
  const chokidar = require('chokidar');
  const watcher = chokidar.watch(__dirname);
  const appRegex = new RegExp(__dirname);
  watcher.on('ready', () => {
    console.log('Watching ./lib directory');
    watcher.on('all', () => {
      console.log('Clearing /lib/ module cache from server');
      Object.keys(require.cache).forEach((id) => {
        if (appRegex.test(id)){
          console.log(id);
          delete require.cache[id];
        }
      });
    });
  });
}
