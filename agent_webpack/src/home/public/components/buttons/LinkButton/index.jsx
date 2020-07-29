import React from 'react';
import { Button } from 'antd';
import classnames from 'classnames';
import './style.less';

const LinkButton = ({ className, ...props }) => {
  return <Button {...props} type="link" className={classnames('antd-btn-link', className)} />;
};

export default LinkButton;
