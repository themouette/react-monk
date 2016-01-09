
## Run through webpack

### Development

* `npm run dev` starts a development environment

Open your browser on `http://localhost:1338` and you're all set.

Full featured environment provides:

  * a webpack-dev-server proxy (with hot reloading) for assets;
  * a node server (with hot reloading);
  * a webpack watcher for server code.

* `npm run test:watch` launch test in a tdd mode.

### Production

* `npm run release` build production code in `dist` folder
* `npm start` starts a production server on port 1338

## Run through babel

> Babel issues:
>
> * missing --extend option in cli (see readme)
> * css-modules are not resolved the same way between 'css-modules-require-hook'
>   and webpack css-loader

### Development

* `npm run babel:dev` starts a development environment

Open your browser on `http://localhost:1338` and you're all set.

Full featured environment provides:

  * a webpack-dev-server proxy (with hot reloading) for assets;
  * a node server (with hot reloading);
  * a babel watcher for server code.

* `npm run test:watch` launch test in a tdd mode.

### Production

* `npm run release` build production code in `dist` folder
* `npm run babel:start` starts a production server on port 1338


