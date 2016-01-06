React-monk component demo using sass
====================================

A component that does not do much but using **scss** and css-modules.

## Install

A global `react-monk` install is required, as this is part of the react-monk
package itself, usage of `npm link` is recommended.

Then run `npm install && npm prepublish`

> In a real world project, you should install `react-monk` locally.

## Scss compilation

Scss compilation is done through node-sass.

Webpack [sass-loader](https://www.npmjs.com/package/sass-loader) is used in
local `webpack.config.js`.
Note that css-modules and autoprefixer configuration is done by **react-monk**,
you only need to manage sass compilation.

Mocha tests are using [css-modules-require-hook
](https://www.npmjs.com/package/css-modules-require-hook). Referencing
**css-modules-require-hook** package in `package.json` is not
required as it is installed with react-monk.

> To use custom sass options, add them to both `webpack.config.js` and
> `src/sass-hook.js`

## Available npm scripts

* `npm run serve:demo`: serve all the applications in `demo` folder
* `npm run test:watch`: launch tests continuously
* `npm prepublish`: transform source files to `./lib`
* `NODE_ENV=production npm run build:demo`: build demo applications for static
  server

## Use development version without link

Run `npm run build:lib:watch -- --out-dir ../my-project/node_modules/simple-component/lib`
to use development version in "my-project".

**WARNING**: `node_modules` and `package.json` files are not copied, so you have
to install the module at least once in "my-project".
