import React from 'react';
import pubData from 'data';
import Layout from './components/Layout';
import { NoAuthPage } from '@components';

export default {
  id: 'messageSend',
  state: {
    key: 1,
  },
  render() {
    const userAuth = pubData.get('authority');
    return <>{userAuth['544'] ? <Layout /> : <NoAuthPage />}</>;
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
