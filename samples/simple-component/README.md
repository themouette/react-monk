React-monk simple component demo
================================

A component that does not do much.

## Install

A global `react-monk` install is required, usage of `npm link` is recommended.

Then run `npm install && npm prepublish`

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
