import React from 'react';
import { shallow, mount } from 'enzyme';
import SideNav from '../src/SideNav';
import mocker from './helper/new-mocker';

function setup(props = {}, children, mounted) {
  const propsIn = {
    trigger: <button className="trigger">Show sidenav</button>,
    ...props
  };
  const component = <SideNav {...propsIn}>{children}</SideNav>;
  const wrapper = mounted ? mount(component) : shallow(component);
  const sideNav = wrapper.find('.sidenav');
  const trigger = wrapper.find('.sidenav-trigger');
  const sideNavProps = sideNav.props();
  const triggerProps = trigger.props();

  return {
    propsIn,
    wrapper,
    sideNav,
    trigger,
    sideNavProps,
    triggerProps
  };
}

describe('<SideNav />', () => {
  describe('initialises', () => {
    const sidenavInitMock = jest.fn();
    const sidenavInstanceDestroyMock = jest.fn();
    const sidenavMock = {
      init: (el, options) => {
        sidenavInitMock(options);
        return {
          destroy: sidenavInstanceDestroyMock
        };
      }
    };
    const restore = mocker('Sidenav', sidenavMock);

    beforeEach(() => {
      sidenavInitMock.mockClear();
      sidenavInstanceDestroyMock.mockClear();
    });

    afterAll(() => {
      restore();
    });

    test('calls SideNav', () => {
      mount(<SideNav />);
      expect(sidenavInitMock).toHaveBeenCalledTimes(1);
    });

    test('renders', () => {
      const { sideNav } = setup();
      expect(sideNav).toMatchSnapshot();
    });

    test('can be `fixed`', () => {
      const component = <SideNav className="red" />;
      const wrapper = shallow(component);
      const sideNav = wrapper.find('.sidenav-fixed');
      expect(sideNav).toMatchSnapshot();
    });

    test('can render a `trigger`', () => {
      const { trigger } = setup({ className: 'green' });
      expect(trigger).toMatchSnapshot();
    });

    test('should be fixed if no trigger is passed', () => {
      const { sideNavProps } = setup({
        id: 'test123',
        options: {},
        shouldTransfer: true
      });
      const component = <SideNav className="red" />;
      const wrapper = shallow(component);
      const sideNav = wrapper.find('.sidenav-fixed');
      expect(sideNav).toMatchSnapshot();
      expect(sideNavProps.trigger).toBeUndefined();
    });

    test('should render a given id', () => {
      const { sideNavProps, triggerProps } = setup({ id: 'test' });
      expect(sideNavProps.id).toEqual('test');
      expect(triggerProps['data-target']).toEqual('test');
    });

    test('should render children', () => {
      const { sideNav } = setup({}, <span className="test-child" />);
      const children = sideNav.find('.test-child');

      expect(children).toHaveLength(1);
    });

    test('should call sideNav with the given options', () => {
      const options = {
        closeOnClick: true,
        edge: 'right'
      };
      mount(<SideNav trigger={<span>trigger</span>} options={options} />);
      expect(sidenavInitMock).toHaveBeenCalledWith(options);
    });

    test('should be destroyed when unmounted', () => {
      const component = shallow(<SideNav className="red" />);
      component.unmount();
      expect(sidenavInstanceDestroyMock).toHaveBeenCalled();
    });
  });
});
