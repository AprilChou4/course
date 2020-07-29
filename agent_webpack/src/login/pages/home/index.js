// 云财税登录页
import React from 'react';
import sso from '@login/public/sso';
import effects from './effects';
import Main from './components/Main';
export default {
  state: {
    dataSource: [],
  },
  effects,
  render() {
    return <Main />;
  },
  onInit() {
    this.store.dispatch({
      type: 'initData',
    });
    sso({}, this.store.dispatch);
  },
};
