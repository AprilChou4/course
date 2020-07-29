import React, { forwardRef } from 'react';
import { Input } from 'antd';
import classnames from 'classnames';

const AntdInput = forwardRef(({ className, ...restProps }, ref) => {
  return (
    <Input
      autoComplete="off"
      className={classnames('antd-input', className)}
      {...restProps}
      ref={ref}
    />
  );
});

export default AntdInput;
