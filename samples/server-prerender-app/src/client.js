import React from 'react';
import ReactDOM from 'react-dom';

import App from './containers/index';

let renderDiv = document.getElementById('app');
if (!renderDiv) {
  renderDiv = document.createElement('div');
  renderDiv.id = 'app';
  document.body.appendChild(renderDiv);
}

ReactDOM.render(<App />, renderDiv);
