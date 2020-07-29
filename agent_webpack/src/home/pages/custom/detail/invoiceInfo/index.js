import React from 'react';
import Main from './components/Main';
import effects from './effects';

export default {
  id: 'customer_detail_invoiceInfo',
  state: {
    // 处于编辑状态
    isEditing: false,
    // 表单参数
    formParams: {},
    // 内容是否改变,用于判断是否弹窗提示
    isContChange: false,
    // 是否显示代理关系真实性验证区域
    isShowAgentRelation: false,
    // 代理关系验证的状态0:未验证 1:验证中 2:已验证 3:已解除
    agentStatus: null,
    // 是否显示税号补充的弹窗
    isShowCreditCodeModal: false,
    // 代理关系验证码
    verificationCode: '',
    // 初始的开票方式，用来当开票方式切换“纸电一体”时出错时，复位用的。
    initialBillingMethod: 0,
  },
  effects,
  render() {
    return <Main />;
  },
  onInit() {},
};
