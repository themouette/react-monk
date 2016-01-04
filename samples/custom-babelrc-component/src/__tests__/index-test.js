import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import MyAwesomeComponent from '../index';

describe('<MyAwesomeComponent />', () => {
	it('renders a <p /> components', () => {
    const wrapper = shallow(<MyAwesomeComponent />);
    expect(wrapper.find('p')).to.have.length(1);
  });
});
