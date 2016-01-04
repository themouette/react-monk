import React, { PropTypes, Component } from 'react';
import styles from './index.css';

const { func } = PropTypes;

class MyAwesomeComponent extends Component {
  render() {
      return <div className={styles.wrapper}>
        <p>Hello World</p>
    </div>;
  }
}

export default MyAwesomeComponent;
