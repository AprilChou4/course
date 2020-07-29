import React from 'react';
import { router } from 'nuomi';
import Layout from './components/Layout';
import effects from './effects';

const defaultCurrent = 1;
const defaultPageSize = 15;
const defaultTableOptions = {
  rowKey: 'accountId',
  bordered: false,
  dataSource: [],
  selectedRowKeys: [],
  pagination: {
    size: 'large',
    current: defaultCurrent,
    pageSize: defaultPageSize,
    pageSizeOptions: ['15', '50', '100'],
    showTotal: (total) => `共${total}条`,
    showSizeChanger: true,
  },
  scroll: { y: true },
};
export default {
  id: 'accountRecycleBin',
  state: {
    visible: false,
    query: {
      current: defaultCurrent,
      pageSize: defaultPageSize,
    },
    table: {
      ...defaultTableOptions,
    },
  },
  effects,
  render() {
    return <Layout />;
  },
  onInit() {
    const {
      query: { visible },
    } = router.location();
    this.store.dispatch({
      type: 'updateState',
      payload: {
        visible: !!visible,
      },
    });
  },
};
