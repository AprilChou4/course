// 记账平台
import React from 'react';
import { router, Nuomi } from 'nuomi';
import pubData from 'data';
import effects from './effects';
import { NoAuthPage } from '@components';
import Layout from './components/Layout';
import recycleBin from './recycleBin';
import accountHandover from './accountHandover';

export default {
  id: 'account',
  state: {
    key: 1,
    // 记账会计列表
    operators: [],
    operatorMap: {},
    // 主管会计列表
    creators: [],
    creatorMap: {},
    // 查询条件
    query: {},
    // 开始时间
    startDate: '',
    // 结束时间
    endDate: '',
    // 排序列
    columnSource: [],
    // 当前页码
    current: 1,
    // 数据总数
    total: 0,
    // 每页显示数量
    pageSize: '',
    // 加载数据时loading状态
    loading: false,
    // 表格数据
    dataSource: [],
    // 表格选中数据
    selectedRowKeys: [],
    selectedRows: [],
    // 排序查询条件
    sorters: '',
    // 是否开启审核
    enabledReview: false,
    // 汇总数据（选择月份）
    totalData: {
      // 建账数量
      createdNum: 0,
      // 未开始数量
      notStartNum: 0,
      // 进行中数量
      ongoingNum: 0,
      // 未结账数量
      notCheckOutNum: 0,
      // 已结账数量
      checkOutNum: 0,
      // 理票中数量
      arrangingNum: 0,
      // 已理票数量
      arrangedNum: 0,
      // 待审核数量
      noReviewNum: 0,
      // 记账中数量
      registeringNum: 0,
    },
    // 编辑账套
    editAccount: {
      visible: false,
      record: {},
    },
  },
  effects,
  render() {
    const userAuth = pubData.get('authority');
    return userAuth[56] ? (
      <>
        <Layout />
        <Nuomi {...accountHandover} />
        <Nuomi {...recycleBin} />
      </>
    ) : (
      <NoAuthPage />
    );
  },
  onChange: {
    $isShowRecycleBin() {
      const {
        query: { visible },
      } = router.location();
      this.store.dispatch({
        type: 'accountRecycleBin/updateState',
        payload: {
          visible: !!visible,
        },
      });
    },
    query() {
      this.store.dispatch({
        type: 'initData',
      });
    },
  },
  onInit() {
    const userAuth = pubData.get('authority');
    if (!userAuth[56]) return;

    this.store.dispatch({
      type: 'updateState',
      payload: {
        key: new Date().getTime(),
      },
    });
  },
};
