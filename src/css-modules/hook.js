/**
 * Allow css modules to be required
 *
 * Make your own and require it in your project to customize
 */
import hook from 'css-modules-require-hook';

hook({
  extensions: ['css'],
  generateScopedName: function(exportedName, path) {
    return exportedName;
  },
  // Look at https://www.npmjs.com/package/css-modules-require-hook#preprocesscss-function
  // to setup a preprocessor
  //
  // import sass from 'node-sass';
  // preprocessCss: (css, filename) => sass.renderSync({ data: css }).css,
  //
  // import stylus from 'stylus';
  // preprocessCss: (css, filename) => stylus(css).set('filename', filename).render(),
});
