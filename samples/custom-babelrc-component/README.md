React-monk demo custom .babelrc
===============================

A component with custom .babelrc.

## Install

A global `react-monk` install is required, usage of `npm link` is recommended.

Then run `npm install && npm prepublish`

## Babel configuration extension

Note that **react** and **es2015** presets are loaded form `react-monk`, you
don't have to worry about including them.

`react-monk serve` also add react hot module reloading goodness.

## Available npm scripts

* `npm run test:watch`: launch tests continuously
* `npm prepublish`: transform source files to `./lib`

