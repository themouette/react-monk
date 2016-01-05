react-monk
==========

> WARNING
>
> react-monk transform relies on https://github.com/babel/babel/pull/3234
>
> It it does not get merged, it means a lot of work to replicate babel-cli
> features.
> Instead, generating a local .babelrc would be a better option

React-monk is here to help you with the JavaScript fatigue.

Set up quickly a working environment with:

* react
* webpack
* css modules
* babel6
* hot module replacement
* ...

## Setup a react monk project

``` javascript
npm init -y
npm install react-monk --save-dev
npm install react react-dom --save
```

You're all set!

## Transform module

Create a `src/index.js` file with the following content:

``` javascript
import React from 'react';
import { someClass } from './index.css';

export default class RenderComponent extends React.Component {
  render() {
    return <div>
      <h1 className={someClass}>Hello World</h1>
    </div>;
  }
};
```

Now run `./node_modules/.bin/react-monk transform src` to publish the code from
`src` to `lib` directory.

It is ready for npm consuming.

> run `./node_modules/.bin/react-monk help transform` for more options.

## Serve application

Create a `samples/basic.js` file with the following content:

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

Now run `./node_modules/.bin/react-monk serve samples/basic.js`.
Open you browser at `http://localhost:1337` to see you sample application.

> run `./node_modules/.bin/react-monk help serve` for more options.

## Build application

Using the previous `samples/basic.js` file, run `./node_modules/.bin/react-monk
build samples/basic.js --html 'Sample application'` to generate a bundle in
`dist` directory.

> run `./node_modules/.bin/react-monk help build` for more options.

## Test

Create a `src/index-test.js` file with the following content:

``` javascript
import RenderComponent from './index';

it('should work', () => { });
```

Launch mocha tests with `./node_modules/.bin/react-monk test src`

> run `./node_modules/.bin/react-monk help test` for more options.
> All unknown options are forwarded to mocha runtime.

## Custom config

react-monk extends the existing

* .baberc
* webpack configuration (Not yet implemented, but designed to, ping me if you
  need it)

