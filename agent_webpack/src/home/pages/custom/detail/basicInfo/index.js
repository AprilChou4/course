// 客户详情 > 基本信息1
import React from 'react';
import effects from './effects';
import Main from './components/Main';

export default {
  id: 'customer_detail_basicInfo',
  state: {
    // 所需form表单参数
    formParams: {},
    // 内容是否改变,用于判断是否弹窗提示
    isContChange: false,
    // 股东信息
    shareholderList: [],
    // 是否处于编辑状态
    isEditing: false,
    // 输入建议：客户下拉列表
    customerOptions: [],
    key: 1,
    // 是否开启国票通道 任务 #138216
    isNationalTicket: false,
  },
  effects,
  render() {
    return <Main />;
  },
  onInit() {},
};
