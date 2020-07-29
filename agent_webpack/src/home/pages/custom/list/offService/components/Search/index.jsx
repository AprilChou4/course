import React, { Component, useCallback } from 'react';
import { Input } from 'antd';
import { connect } from 'nuomi';

const { Search } = Input;
const SearchInput = ({ dispatch }) => {
  // 搜索
  const search = useCallback(
    (value) => {
      dispatch({
        type: 'updateState',
        payload: {
          query: { customerName: value },
        },
      });
      dispatch({
        type: '$stopCustomerList',
        payload: {
          ...(value ? { customerName: value } : {}),
          current: 1,
        },
      });
    },
    [dispatch],
  );

  // 清除的时候
  const change = useCallback(
    (e) => {
      const { value } = e.target;
      if (!value) {
        search('');
      }
    },
    [search],
  );

  return (
    <Search
      placeholder="请输入客户名称/客户编码搜索"
      onSearch={search}
      onChange={change}
      style={{ width: '320px' }}
      name="customerName"
      autoComplete="off"
      allowClear
      enterButton
    />
  );
};
// class SearchInput extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {};
//   }

//   // 搜索
//   search = (value) => {
//     const { dispatch } = this.props;
//     dispatch({
//       type: '$stopCustomerList',
//       payload: {
//         ...(value ? { customerName: value } : {}),
//       },
//     });
//   };

//   // 清除的时候
//   change = (e) => {
//     const { value } = e.target;
//     if (!value) {
//       this.search('');
//     }
//   };

//   render() {
//     return (
//       <Search
//         placeholder="请输入客户名称/客户编码搜索"
//         onSearch={this.search}
//         onChange={this.change}
//         style={{ width: '320px' }}
//         name="customerName"
//         autoComplete="off"
//         allowClear
//         enterButton
//       />
//     );
//   }
// }
export default connect()(SearchInput);
