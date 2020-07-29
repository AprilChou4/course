// 大按钮
import React from 'react';
import { Button } from 'antd';

import Style from './style.less';

const BigButton = ({ text = '下一步', className, ...rest }) => {
  return (
    <Button
      type="primary"
      size="large"
      className={`${Style['m-bigButton']} ${className}`}
      {...rest}
    >
      {text}
    </Button>
  );
};
export default BigButton;
