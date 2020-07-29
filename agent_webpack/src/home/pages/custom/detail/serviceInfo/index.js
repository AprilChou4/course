// 客户详情 > 服务信息4
import React from 'react';
import effects from './effects';
import Main from './components/Main';

export default {
  id: 'customer_detail_serviceInfo',
  state: {
    // false=查看 true=编辑
    isEdit: false,
    // 内容是否改变,用于判断是否弹窗提示
    isContChange: false,
    // 服务信息详情数据
    serviceInfoDetail: {},
    // 服务信息联系人列表
    customerContactList: [],
    // 客户等级(valeu:1,普通用户，2重点客户,其他自定义客户等级)
    customerLevelList: [],
    // 客户来源（value值 1业务员接单，2员工推荐，3客户推荐，4自推广）
    customerSourceList: [],
    // 取票方式（value值0上门取票，1快递，3客户自送）
    ticketTypeList: [],
    // 所有员工合集
    allEmployeeList: [],
    // 接单人、推荐人等
    staffList: [],
    // 记账会计
    bookeepers: [],
    // 会计助理=2
    accountAssistant: [],
    // 报税会计=4
    taxReporter: [],
    // 开票员=3
    drawerList: [],
    // 客户顾问=5
    customAdviser: [],
    // 服务类型
    serviceTypeList: [],
    // 客户服务类型关系列表
    customerServiceRelationList: [],
  },
  effects,
  render() {
    return <Main />;
  },
  onInit() {},
};
