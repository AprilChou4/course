// 客户管理列表
import React from 'react';
import { Modal } from 'antd';
import effects from './effects';
import Main from './components/Main';

export default {
  id: 'customer_detailLayout',
  state: {
    // string 1=基本信息; 2=税务信息; 3=开票信息; 4=服务信息; 5=附件管理;
    tabType: '1',
    // 税务引导弹窗
    taxGuideVisible: false,
    // 税务引导轮播图弹窗
    taxSliderVisible: false,
    // 税务引导轮播图弹窗>关闭后提示弹窗
    taxCloseTipVisible: false,
  },
  effects,
  render() {
    const { params } = this.location;
    return <Main {...params} />;
  },
  onChange: {
    // 路由更新时
    update() {
      // console.log('update');
    },
  },
  onInit() {
    this.store.dispatch({
      type: 'initData',
    });
  },
  onLeave() {
    // 离开时把二次确认的弹窗都关闭。
    Modal.destroyAll();
  },
};
