/**
 * （新增）应收单
 */
import React from 'react';
import Main from './components/Main';
import effects from './effects';

export default {
  id: 'receivable',
  state: {
    title: '应收单',
    // 页面状态
    status: 0,
    // 主页面的form
    form: undefined,
    // form初始值
    formInitialValues: {},
    // 客户列表
    customerList: [],
    // 业务员列表
    businessStaffList: [],
    // 服务类型
    serviceItemsList: [],
    // 表格行的key
    tableRowKey: 'itemOrder',
    // 表格行key叠加器
    tableRowKeyCounter: 2,
    // 服务项目表格
    tableData: [{ itemOrder: 0 }, { itemOrder: 1 }, { itemOrder: 2 }],
    // 表格金额合计
    tableSumMoney: 0,
  },
  effects,
  render() {
    return <Main />;
  },
  onChange: {
    query() {
      this.store.dispatch({
        type: 'query',
      });
    },
  },
  onInit() {
    this.store.dispatch({
      type: 'initData',
    });
  },
};
