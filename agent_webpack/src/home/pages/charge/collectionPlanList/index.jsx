// -----------应收单>查看收款计划>收款计划汇-----------
import React from 'react';
import moment from 'moment'; // eslint-disable-line
import Layout from './components/Layout';
import effects from './effects';

export default {
  state: {
    key: 1,
    // true=收款计划表 false=收款计划明细表
    tableType: true,
    // =====收款计划表=====
    // 表格list
    planTableList: [],
    // 查询条件
    // planCondition: {},
    query: {},
    // =====收款计划明细表=====
    // 表格list
    detailTableList: [],
    // // 表格选中数据
    selectedRowKeys: [],
    selectedRows: [],
    // 实收金额=统计
    totalMoney: {},
    // 收款计划id
    // shouldReceiveId: '',
    // 收款计划表客户信息
    shouldReceiveBillData: {},
  },
  effects,
  render() {
    return <Layout />;
  },
  onChange: {
    query() {
      this.store.dispatch({
        type: 'initData',
      });
    },
  },
  onInit() {
    this.store.dispatch({
      type: 'updateState',
      payload: {
        key: new Date().getTime(),
      },
    });
  },
};
