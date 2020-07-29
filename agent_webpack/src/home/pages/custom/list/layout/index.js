// 客户管理列表
import React from 'react';
import pubData from 'data';
import NoAuthPage from '@components/NoAuthPage';
import effects from './effects';
import Main from './components/Main';

export default {
  id: 'custom_layout',
  state: {
    // string 1=服务中客户; 2=停止服务客户
    tabType: '1',
    // 切换服务中客户/停止服务客户是否刷新
    isNeedRefresh: false,
  },
  effects,
  render() {
    const userAuth = pubData.get('authority');
    return <>{userAuth['3'] ? <Main /> : <NoAuthPage />}</>;
  },
  onChange: {
    // 每次都会刷新，性能较差===待优化
    // 每次切换到客户管理，onIinit会执行，
    // $update() {
    //   const { tabType } = this.store.getState();
    //   const url = tabType === '1' ? 'custom_inService/listInitQuery' : 'custom_offService/initData';
    //   this.store.dispatch({
    //     type: url,
    //   });
    // },
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
