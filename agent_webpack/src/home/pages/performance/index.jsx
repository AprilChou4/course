import React from 'react';
import moment from 'moment'; // eslint-disable-line
import Layout from './components/Layout';
import effects from './effects';

export default {
  state: {
    // 表格的list
    tableList: [{}],
    // 总数
    total: 0,

    // 表格数据请求条件
    tableConditions: {
      period: moment().format('YYYY-MM'),
      deptId: '',
      order: 1,
      current: 1,
      pageSize: 20,
    },
    // 部门树
    departmentList: [],
  },
  effects,
  render() {
    return <Layout />;
  },
  onInit() {
    this.store.dispatch({
      type: 'initData',
    });
  },
};
