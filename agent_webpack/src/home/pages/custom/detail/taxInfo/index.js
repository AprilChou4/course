// 客户详情 > 税务信息2
import React from 'react';
import Layout from './components/Layout';
import effects from './effects';

export default {
  id: 'customer_detail_taxInfo',
  state: {
    // 处于编辑状态
    isEditing: false,
    // 表单参数
    formParams: {},
    // 内容是否改变,用于判断是否弹窗提示
    isContChange: false,
    // 表单税种信息集合
    formTaxList: [],
    // 税务信息列表
    taxList: [],
    // 支持申报方式类型
    declarationTypes: [0, 1, 2, 3],
    // 登录方式的表单数据
    loginModeForm: {},
    // 登录信息的字段，根据申报方式取不通的字段作为初始值
    loginFileds: [
      ['username', 'password'],
      ['_', 'passwordCa'],
      ['_', 'passwordTaxControl'],
      ['usernameTaxTray', 'passwordTaxTray'],
      ['sMSVerificationUsername', 'sMSVerificationPassword', 'loginIdentity', 'phoneNum'],
    ],
    // 短信验证码所需要的数据
    smsverificationData: {
      sMSVerificationLoginIdentity: 0,
      sMSVerificationPassword: 0,
      sMSVerificationPhoneNum: 0,
      sMSVerificationUserName: 0,
      loginIdentityInfoList: [],
    },
    // 是否开启国票通道 任务 #138216
    isNationalTicket: false,
    //
    // // 税务引导弹窗
    // taxGuideVisible: false,
    // // 税务引导轮播图弹窗
    // taxSliderVisible: false,
    // // 税务引导轮播图弹窗>关闭后提示弹窗
    // taxCloseTipVisible: false,
  },
  effects,
  render() {
    return <Layout />;
  },
  onInit() {
    // 财税助手可以单独嵌入该Tab内容, 单独请求。 #129516
    if (!this.location) return; // 单独嵌入该页面会存在this.location
    const { customerId, cszs } = this.location.query;
    if (customerId && cszs) {
      // cszs代表单独嵌入 表单会根据该标识作不同表现
      this.store.dispatch({
        type: 'initData',
      });
    }
  },
};
