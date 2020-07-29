/* eslint-disable react/jsx-props-no-spreading */
import React, { forwardRef } from 'react';
import classnames from 'classnames';
import If from '../If';
import './style.less';

const wrapper = (_className) =>
  forwardRef(({ className, children, ...restProps }, ref) => (
    <If condition={children}>
      <div ref={ref} {...restProps} className={classnames(_className, className)}>
        {children}
      </div>
    </If>
  ));

const Layout = wrapper('layout-wapper');

Layout.Container = wrapper('layout-wapper-container');

Layout.PageWrapper = wrapper('layout-wapper-page');

Layout.Title = wrapper('layout-title t-bold');

Layout.Header = wrapper('layout-header f-clearfix');

Layout.Left = wrapper('layout-left');

Layout.Right = wrapper('layout-right');

Layout.Content = wrapper('layout-content');

Layout.BFCContent = wrapper('layout-bfc-content');

export default Layout;
