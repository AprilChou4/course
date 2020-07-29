import React, { forwardRef } from 'react';
import { Input } from 'antd';
import classnames from 'classnames';
import './style.less';

const { Search } = Input;

const AntdSearch = forwardRef(({ className, ...restProps }, ref) => {
  return (
    <Search
      allowClear
      enterButton
      autoComplete="off"
      className={classnames('antd-search', className)}
      {...restProps}
      ref={ref}
    />
  );
});

export default AntdSearch;
