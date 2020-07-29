import React from 'react';
import effects from './effects';
import Layout from './components/Layout';

export default {
  state: {
    dataSource: [],
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
