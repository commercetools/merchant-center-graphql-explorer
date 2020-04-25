import React from 'react';
import { shallow } from 'enzyme';
import { ApplicationStarter } from './entry-point';

describe('rendering', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<ApplicationStarter />);
  });
  it('should render graphql-explorer route', () => {
    expect(wrapper).toRender({ path: '/:projectKey/graphql-explorer' });
  });
});
