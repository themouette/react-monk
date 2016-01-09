import React, { PropTypes, Component } from 'react';
import styles from './index.css';

const { func } = PropTypes;

class Index extends Component {
  render() {
    return <p className={`${styles.container} ${styles.something}`}>Hello World</p>;
  }
}

export default Index;
