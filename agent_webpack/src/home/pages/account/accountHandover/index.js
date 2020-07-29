import React from 'react';
import Layout from './components/Layout';
import effects from './effects';

const defaultTableOptions = {
  bordered: false,
  emptyType: 'default',
  rowKey: 'recordId',
  dataSource: [],
  pagination: {
    showSizeChanger: true,
    size: 'large',
    current: 1,
    pageSize: 15,
    pageSizeOptions: ['15', '50', '100'],
    showTotal: (total) => `共${total}条`,
  },
  scroll: { y: true },
};
export default {
  id: 'accountHandover',
  state: {
    visible: false,
    activeKey: 'receive',
    allAccounts: [], // 所有非交接中的账套
    // 指派记账会计
    assignAccounting: {
      visible: false,
      record: {},
    },
    // 移交账套
    transferSubmit: {
      visible: false,
      submitData: {},
    },
    transfering: {
      ...defaultTableOptions,
      title: () => '移交中',
    },
    historicalTransfer: {
      ...defaultTableOptions,
      title: () => '历史移交',
    },
    toReceive: {
      ...defaultTableOptions,
      title: () => '待接收',
    },
    historicalReception: {
      ...defaultTableOptions,
      title: () => '历史接收',
    },
  },
  effects,
  render() {
    return <Layout />;
  },
  onInit() {},
};
