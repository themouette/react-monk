import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import styles from '../index.scss';
import MyAwesomeComponent from '../index';

describe('<MyAwesomeComponent />', () => {
	it('renders a <p /> components', () => {
    const wrapper = shallow(<MyAwesomeComponent />);
    expect(wrapper.find('p')).to.have.length(1);
  });

  it('renders an `.wrapper`', () => {
    const wrapper = shallow(<MyAwesomeComponent />);
    // due to css-modules composes, we split classnames
    expect(wrapper.find(`.${styles.wrapper.split(' ')[0]}`)).to.have.length(1);
  });
});
