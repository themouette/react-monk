import React, { PropTypes, Component } from 'react';

const { func } = PropTypes;

class MyAwesomeComponent extends Component {
  static propTypes = {};
  static defaultProps = {};

  render() {
    return <p>Hello World</p>;
  }
}

export default MyAwesomeComponent;
