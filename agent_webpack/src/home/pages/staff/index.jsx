import React from 'react';
import { store } from 'nuomi';
import pubData from 'data';
import { NoAuthPage } from '@components';
import { get } from '@utils';
import Main from './components/Main';
import effects from './effects';

export default {
  id: 'staff',
  state: {
    // 主页面Tab的activeKey
    mainTabActiveKey: 'incumbency',
    // 主页面Tab上的角标
    moduleCounts: {
      pending: 0, // 待审批
      unpassed: 0, // 未通过
    },
  },
  effects,
  render() {
    const userAuth = pubData.get('authority');
    return userAuth[36] ? <Main /> : <NoAuthPage />;
  },
  onChange: {
    query() {
      this.store.dispatch({
        type: 'query',
      });

      const mainTabActiveKey = get(this.store.getState(), 'mainTabActiveKey');
      if (mainTabActiveKey) {
        this.store.dispatch({
          type: `staff_${mainTabActiveKey}/query`,
        });
      }
    },
    // 更新停用员工弹窗数据
    $updateStopStaffModal() {
      const stores = store.getState();
      if (get(stores, 'staff_incumbency.stopStaffModal.visible')) {
        this.store.dispatch({
          type: 'staff_incumbency/updateStopStaffModal',
        });
      }
    },
  },
  onInit() {
  },
};
