/**
 * 部门员工-未通过
 */
import React from 'react';
import Main from './components/Main';
import effects from './effects';

const defaultCurrent = 1;
const defaultPageSize = 20;

export default {
  id: 'staff_unpassed',
  state: {
    // 员工表格数据
    staffList: [],
    // 员工表格分页
    pagination: {
      total: 0, // 数据总数
      current: defaultCurrent, // 当前页
      pageSize: defaultPageSize, // 每页条数
    },
    // 表格查询参数
    query: {
      current: defaultCurrent,
      pageSize: defaultPageSize,
    },
    // 顶部搜索框的值
    name: '',
  },
  effects,
  render() {
    return <Main />;
  },
  onInit() {
    this.store.dispatch({
      type: 'initialQuery',
    });
  },
};
