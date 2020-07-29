// 收款单列表
import React from 'react';
import pubData from 'data';
import moment from 'moment';
import { NoAuthPage } from '@components';
import Layout from './components/Layout';
import effects from './effects';

export default {
  state: {
    query: {},
    operators: [],
    creators: [],

    // 表格的list
    tableList: [],
    // // 表格选中数据
    selectedRowKeys: [],
    selectedRows: [],
    // 总数
    total: 0,
    // 实收金额=统计
    totalMoney: {},
    pageSizeOptions: ['50', '100', '200', '300'],
    // 表格数据请求条件
    tableConditions: {
      current: 1,
      pageSize: 20,
      // 制单日期(开始)
      beginCreateBillDate: Number(
        moment()
          .startOf('year')
          .format('X'),
      ),
      // 制单日期(结束)
      endCreateBillDate: Number(
        moment()
          .endOf('day')
          .format('X'),
      ),
    },
    // 员工列表 制单人/业务员/收款人
    staffList: [],
    // 部门树
    deptList: [],
    // 服务项目列表
    chargeItemList: [],
    // 删除失败弹窗
    delFailVisible: false,
    // 删除失败返回数据
    delFailData: {},
  },
  effects,
  render() {
    const userAuth = pubData.get('authority');
    return <>{userAuth['583'] ? <Layout /> : <NoAuthPage />}</>;
  },
  onChange: {
    query() {
      this.store.dispatch({
        type: 'initData',
      });
    },
  },
  onInit() {},
};
