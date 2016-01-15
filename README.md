react-monk
==========

> WARNING
>
> React monk is under development and changes quickly
> the best way to install is to git clone + npm link.
>
> ``` sh
> git clone https://github.com/themouette/react-monk.git
> cd react-monk
> npm link
> ```

React-monk is here to help you with the JavaScript fatigue.

Set up quickly a working environment with:

* react
* webpack
* css modules
* babel6
* hot module replacement
* ...

## How does it works?

1. install **react-monk** `npm install react-monk --save-dev`
2. profit with es2015, css modules, hot module replacement

> As all projects are different, **react-monk** will not get into your way.
> You can extend configuration with standard `webpack.config.js` and `.babelrc`,
> they will be parsed and upgraded with **react-monk** goodness.

Check [samples](https://github.com/themouette/react-monk/tree/master/samples)
to see it in action.

## Setup a react monk project

``` javascript
npm init -y
# npm install react-monk --save-dev
# Instead, use npm link react-monk
npm install react react-dom --save
```

You're all set!

## Serve Client Side Application

Create a `src/client.js` file with the following content:

``` javascript
import React from 'react';
import ReactDOM from 'react-dom';
import RenderComponent from '../src/index';


let renderDiv = document.getElementById('app');
if (!renderDiv) {
  renderDiv = document.createElement('div');
  renderDiv.id = 'app';
  document.body.appendChild(renderDiv);
}

ReactDOM.render(<RenderComponent />, renderDiv);
```

Now run `./node_modules/.bin/react-monk serve src/client.js`.

Open you browser at `http://localhost:1337/client.html` to see your new
application.

HINT: you can proxify requests to a backend server with `--proxy` parameter.

> run `./node_modules/.bin/react-monk help serve` for more options.

## Serve Server Side Application

1. Create a `src/server.js` file with the following content:

``` javascript
// file: start.js
import http from 'http';
import app from './server/app.js';

const server = http.createServer(app);

const port = process.env.PORT || 1337;
server.listen(port, '0.0.0.0', () => {
  console.log('Listening on port ' + port);
});

if (module.hot) {

  // This will handle HMR and reload the server
  module.hot.accept('./server/app.js', function() {
    server.removeListener('request', app);
    app = require('./server/app.js');
    server.on('request', app);
    console.log('Server reloaded!');
  });
}
```

2. And a `src/server/app.js` file with an express server:

```
import express from 'express';

const app = express();

app.get('*', (req, res, next) => {
  res.status(404).send("Page not found");
});

export app;
```

3. Run the hot reloading server using `./node_modules/.bin/react-monk start
   src/server.js`

4. Open your browser at `http://localhost:1337`. When you edit code, server code
   is hot reloaded

> run `./node_modules/.bin/react-monk help serve` for more options.

## Build application

You should not rely on **react-monk** to run code in production. Use the build
capabilities to produce an optimized bundle for both client and server code.

Using the previous `src/client.js` and `src/server.js` files, run:

```
./node_modules/.bin/react-monk build 'src/client.js' -o dist/client/ --production
./node_modules/.bin/react-monk build 'src/server.js' -o dist/server/ --target node --production
```

The `dist` folder contains production ready bundles.
Start server using `node dist/server/server.js`.

> run `./node_modules/.bin/react-monk help build` for more options.

## Test

Create a `src/index-test.js` file with the following content:

``` javascript
import RenderComponent from './index';

it('should work', () => { });
```

Launch mocha tests with `./node_modules/.bin/react-monk mocha src`

> run `./node_modules/.bin/react-monk help mocha` for more options.
> All unknown options are forwarded to mocha runtime.

## Custom config

react-monk extends the existing configurations:

* .baberc
* webpack configuration

