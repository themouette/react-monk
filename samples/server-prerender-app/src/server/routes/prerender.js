import React from 'react';
import ReactDomServer from 'react-dom/server';


export default (app, urlPrefix = '/') => {
  app.get(urlPrefix, (req, res, next) => {
    // Require App component every time to ensure this is the last version
    const App = require('../../containers/index').default;
    const reactHtml = ReactDomServer.renderToString(<App />);
    res.render('index.ejs', {reactOutput: reactHtml});
  });
};
