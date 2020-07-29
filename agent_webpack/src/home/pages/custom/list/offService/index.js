// 客户管理列表
import React from 'react';
import effects from './effects';
import Main from './components/Main';

export default {
  id: 'custom_offService',
  state: {
    // 当前页码
    current: 1,
    // 数据总数
    total: 0,
    // 每页显示数量
    pageSize: 20,
    // 表格数据
    dataSource: [],
    // 表格选中数据
    selectedRowKeys: [],
    selectedRows: [],
    // 列表操作行
    currRecord: {},
    query: {},
    // 记账会计
    bookeepers: [],
    // 恢复弹窗
    renewVisible: false,
  },
  effects,
  render() {
    return <Main />;
  },
  onInit() {
    this.store.dispatch({
      type: 'initData',
    });
  },
};
