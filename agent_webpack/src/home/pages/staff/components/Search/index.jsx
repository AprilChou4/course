import React from 'react';
import { AntdSearch } from '@components';

const Search = (props) => {
  return <AntdSearch placeholder="请输入姓名/手机号搜索" {...props} />;
};

export default Search;
