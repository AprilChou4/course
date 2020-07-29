import React from 'react';
import classnames from 'classnames';
import './style.less';

const wrapper = (_className) => ({ className, children, ...rest }) => (
  <div className={classnames(_className, className)} {...rest}>
    {children}
  </div>
);

const Content = wrapper('content-wrapper');

Content.Head = wrapper('content-head f-clearfix');

Content.Left = wrapper('content-head-left');

Content.Right = wrapper('content-head-right');

Content.Body = wrapper('content-body');

export default Content;
