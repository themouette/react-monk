import React from 'react';
import ReactDOM from 'react-dom';

import styles from './index.scss';
import MyAwesomeComponent from '../src/index';

class RenderComponent extends React.Component {
  render() {
    return <div className={styles.samples}>
      <div className={styles.sample}>
        <h1>This is a second demo</h1>
        <MyAwesomeComponent />
      </div>
      <a href="./index.html">Main sample</a>
    </div>;
  }
};

let renderDiv = document.getElementById('app');
if (!renderDiv) {
  renderDiv = document.createElement('div');
  renderDiv.id = 'app';
  document.body.appendChild(renderDiv);
}

ReactDOM.render(<RenderComponent />, renderDiv);

