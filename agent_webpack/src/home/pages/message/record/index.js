import React from 'react';
import pubData from 'data';
import { NoAuthPage } from '@components';
import effects from './effects';
import Main from './components/Main';

export default {
  id: 'messageRecord',
  state: {
    key: 1,
    // string 1=定时发送; 2=发送成功; 3=发送失败; 默认1
    tabType: '1',
    // 查询条件
    query: {},
    // 展示表格0;展示详情1 默认0
    displayType: 0,
    // 当前页码
    current: 1,
    // 数据总数
    total: 0,
    // 每页显示数量
    pageSize: 100,
    // 表格数据
    dataSource: [],
    // 失败详情表格选中数据
    selectedRowKeys: [],
    selectedRows: [],
    // 当前编辑的定时消息数据
    currentEditMessage: {},
    // 定时发送> 详情弹窗; 发送失败>重新发送
    isDetailVisible: false,
    // 定时发送> 详情弹窗=0;  发送失败>重新发送=1
    detailModalType: 0,
    // 失败红点
    redCount: 0,
    // 列表操作行
    currRecord: {},
    // 成功失败消息详情
    detailInfo: {},
    // 失败列表>是否忽略
    isIgnore: false,
    // 失败/成功详情搜索
    detailQuery: {},
  },
  effects,
  render() {
    const userAuth = pubData.get('authority');
    return <>{userAuth['548'] ? <Main /> : <NoAuthPage />}</>;
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
