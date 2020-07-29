import React from 'react';
import effects from './effects';
import Main from './components/Main';

export default {
  state: {
    // string 1=系统消息; 2=我的提问; 3=建议反馈; 4=操作日志; 默认1
    tabType: '1',
    // 查询条件
    query: {},
    // 展示表格=0; 展示详情=1 默认0
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
    // 当前操作列
    currRecord: {},
    // 当前显示详情的系统消息
    currSysMsgDetail: {},
    // 我的提问详情
    quesDetail: {},
    // 建议反馈未读数量
    suggestNum: 0,
    // 系统消息未读数量
    noticeNum: 0,
    // 操作日志数量
    logNum: 0,
  },
  effects,
  render() {
    return <Main />;
  },
  onChange: {
    getNoticeDetail() {
      const {
        query: { type, id },
      } = this.location;
      if (type && id) {
        this.store.dispatch({
          type: 'getNoticeDetail',
          payload: {
            noticeId: id,
            tabType: type,
            displayType: 1,
          },
        });
      }
    },
    // 点击右下角，调到建议反馈
    toFeedback() {
      const { tab } = this.location.query;
      if (tab) {
        this.store.dispatch({
          type: 'updateState',
          payload: {
            tabType: tab,
          },
        });
      }
    },
  },
  onInit() {
    this.store.dispatch({
      type: 'initData',
    });
  },
};
