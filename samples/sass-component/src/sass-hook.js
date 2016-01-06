/**
 * Allow sass css modules to be required
 *
 * Make your own and require it in your project to customize
 */
import hook from 'css-modules-require-hook';
import sass from 'node-sass';

hook({
  extensions: ['.scss'],
  generateScopedName: function(exportedName, path) {
    return exportedName;
  },
  preprocessCss: (css, filename) => sass.renderSync({ data: css }).css,
});

