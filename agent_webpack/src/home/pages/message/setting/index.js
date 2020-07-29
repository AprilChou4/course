import React from 'react';
import pubData from 'data';
import effects from './effects';
import Layout from './components/Layout';
import { NoAuthPage } from '@components';

export default {
  state: {
    key: 1,
    // 所在的tab索引
    tabKey: '0',
    // 模板列表
    templateList: [],
    // 是否展示消息模板模态框
    isShowMessageModal: false,
    // 当前处于编辑的消息模板
    currentTemplate: undefined,
    // 消息模板搜索内容
    templateInputVal: '',

    // 客户分组列表
    groupList: [],
    // 是否展示客户分组模态框
    isShowCustomerModal: false,
    // 当前处于编辑的客户分组
    currentGroup: undefined,
    // 客户分组搜索内容
    groupInputVal: '',
    // 内置分组编辑的模态框
    isShowBuiltInModal: false,
    // 内置客户分组列表
    builtInGroupList: [],
    // 客户列表
    customerList: [],
    // 客户列表的总数，判断是否分页
    customerTotal: 0,
    // 客户列表的参数
    customerParams: {
      current: 1,
      pageSize: 10,
      customerName: '',
      queryCriteria: [],
    },
  },
  effects,
  render() {
    const userAuth = pubData.get('authority');
    return <>{userAuth['548'] ? <Layout /> : <NoAuthPage />}</>;
  },
  onInit() {
    this.store.dispatch({
      type: 'initData',
    });
    this.store.dispatch({
      type: 'updateState',
      payload: {
        key: new Date().getTime(),
      },
    });
  },
};
