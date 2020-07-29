import React from 'react';
import moment from 'moment'; // eslint-disable-line
import { NoAuthPage } from '@components';
import pubData from 'data';
import { router } from 'nuomi';
import Layout from './components/Layout';
import effects from './effects';
import { initialForm } from './utils';

export default {
  state: {
    form: {},
    tableForm: {},
    // 表单的状态，对应右上角按钮变化  0->1  2->3 4->5
    status: 0,
    // 是否是参照应收单
    isReference: false,
    // 是否是查看收款单页面
    isViewPage: false,
    // 参照应收单弹窗
    isShowModal: false,
    // 是否编辑过的标志位
    isEdit: false,
    // 收款单id,
    receiveBillId: '',
    // 表单数据
    formValues: { ...initialForm },
    // 最大使用预收
    maxPreMoney: 0,
    // 收款方式选择列表
    receiptTypeList: [],
    // 收款账号选择列表
    receiptAccountList: [],
    // 收款人列表
    receiptStaffList: [],
    // 业务员列表
    businessStaffList: [],
    // 业务员列表
    customerList: [],
    // 服务项目列表
    serviceList: [],
    // 参照应收单的应收单列表
    ysdList: [],
    // 收款计划明细表
    skjhList: [],
    // 服务项目Map
    serviceItemMap: [],
    // 参照应收单的客户列表
    referenceCustomerList: [],
    // 明细表list
    dataSource: [],
    // 参照的应收单 无明细表时，传给后端这个字段
    receiveBillSubjectItem: [],
    // 明细表中5列的合计
    totalMoney: {
      shouldTotalMoney: 0,
      totalReceiptMoney: 0,
      freeMoney: 0,
      preReceiptMoney: 0,
      userPreReceiptMoney: 0,
    },
    // 收款账号对应的收款方式map
    receiptAccountMap: {},
    // 是否有更新权限（当查看页面且无编辑权限，新增权限包括编辑权限）
    noUpdateAuth: false,
  },
  effects,
  reducers: {
    // 更新表单字段
    updateFormValues: (state, { payload }) => ({
      ...state,
      formValues: { ...state.formValues, ...payload },
    }),
    // 更新form.create创建的form
    updateForm: (state, { payload }) => ({ ...state, form: payload }),
  },
  render() {
    const userAuth = pubData.get('authority');
    const { pathname } = router.location();
    const isViewPage = pathname === '/charge/viewCollection';
    // 有新增权限 或者 列表查看权限
    const hasAuth = isViewPage ? userAuth['583'] : userAuth['581'];
    return <>{hasAuth ? <Layout /> : <NoAuthPage />}</>;
  },
  onChange() {
    // 路由切换更新所有列表数据
    this.store.dispatch({
      type: 'initList',
    });
  },
  onInit() {
    const userAuth = pubData.get('authority');
    const { pathname } = router.location();
    const isViewPage = pathname === '/charge/viewCollection';
    isViewPage && console.log('viewCollection', !userAuth['585']);
    this.store.dispatch({
      type: 'updateState',
      payload: {
        noUpdateAuth: isViewPage && !userAuth['585'],
      },
    });
    // 第一次需要请求，但路由切换不需要重新请求的
    this.store.dispatch({
      type: 'initData',
    });
  },
};
