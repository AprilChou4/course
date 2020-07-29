import { message } from 'antd';
import services from '../services';

export default {
  // 指派记账会计
  updateAssignAccounting(payload = {}) {
    const { assignAccounting } = this.getState();
    this.updateState({
      assignAccounting: {
        ...assignAccounting,
        ...payload,
      },
    });
  },

  // 账套移交-提交
  updateTransferSubmit(payload = {}) {
    const { transferSubmit } = this.getState();
    this.updateState({
      transferSubmit: {
        ...transferSubmit,
        ...payload,
      },
    });
  },

  // 刷新账套移交里的列表
  async updateAccountTransferDatas() {
    // TODO: 待确定是不是并发执行
    this.$getTransferingList();
    this.$getHistoricalTransferList();
    this.getAllAccounts();
    this.dispatch({
      type: 'account/updateMainDatas',
    });
  },

  // 刷新账套接收里的列表
  async updateAccountReceiveDatas() {
    // TODO: 待确定是不是并发执行
    this.$getToReceiveList();
    this.$getHistoricalReceptionList();
    this.dispatch({
      type: 'account/updateMainDatas',
    });
  },

  // 账套移交-查询接收人
  async checkUser(payload) {
    const data = await services
      .checkUser(payload, {
        returnAll: true,
        status: { 300: () => {} },
      })
      .catch((err) => err);
    return data;
  },

  // 账套移交-查询用户所有非交接中的账套
  async getAllAccounts(payload) {
    const data = await services.getAllAccounts(payload, { errMsg: '获取账套失败！' });
    this.dispatch({
      type: 'updateState',
      payload: {
        allAccounts: data || [],
      },
    });
  },

  // 账套移交-移交
  async transfer(payload) {
    await services.transfer(payload, { loading: '正在移交中...' });
    message.success('移交成功');
    this.updateAccountTransferDatas(); // 刷新列表
    return true;
  },

  // 获取移交中记录列表
  async $getTransferingList(payload = {}) {
    const {
      transfering,
      transfering: {
        pagination,
        pagination: { current, pageSize },
      },
    } = this.getState();
    const params = {
      current,
      pageSize,
      ...payload,
    };
    const data = await services.getTransferingList(params, {
      errMsg: '获取移交中记录列表失败！',
    });

    const { list, total } = data || {};
    this.updateState({
      transfering: {
        ...transfering,
        dataSource: list,
        pagination: {
          ...pagination,
          total,
          current: params.current,
          pageSize: params.pageSize,
        },
      },
    });
  },

  // 账套移交-撤回
  async withdraw(payload) {
    await services.withdraw(payload);
    message.success('撤回成功');
    this.updateAccountTransferDatas();
  },

  // 获取移交历史记录列表
  async $getHistoricalTransferList(payload = {}) {
    const {
      historicalTransfer,
      historicalTransfer: {
        pagination,
        pagination: { current, pageSize },
      },
    } = this.getState();
    const params = {
      current,
      pageSize,
      ...payload,
    };
    const data = await services.getHistoricalTransferList(params, {
      errMsg: '获取移交历史记录列表失败！',
    });

    const { list, total } = data || {};
    this.updateState({
      historicalTransfer: {
        ...historicalTransfer,
        dataSource: list,
        pagination: {
          ...pagination,
          total,
          current: params.current,
          pageSize: params.pageSize,
        },
      },
    });
  },

  // 获取待接收记录列表
  async $getToReceiveList(payload = {}) {
    const {
      toReceive,
      toReceive: {
        pagination,
        pagination: { current, pageSize },
      },
    } = this.getState();
    const params = {
      current,
      pageSize,
      ...payload,
    };
    const data = await services.getToReceiveList(params, { errMsg: '获取待接收记录列表失败！' });

    const { list, total } = data || {};
    this.updateState({
      toReceive: {
        ...toReceive,
        dataSource: list,
        pagination: {
          ...pagination,
          total,
          current: params.current,
          pageSize: params.pageSize,
        },
      },
    });
  },

  // 校验账套名称是否重复
  async checkAccountName(payload) {
    try {
      const list = await services.checkAccountName(payload, {
        errMsg: '校验账套名称失败！',
        status: { 300: () => {} },
      });
      return list;
    } catch (error) {
      if (error.status === 300) {
        return error.data;
      }
    }
  },

  // 查询记账会计集合
  async getAccountingList(payload) {
    const accountingList = await services.getAccountingList(payload, {
      errMsg: '获取记账会计列表失败！',
    });
    return accountingList;
  },

  // 账套接收-接收
  async receive(payload) {
    await services.receive(payload);
    this.updateAssignAccounting({
      visible: false,
    });
    this.updateAccountReceiveDatas();
    message.success('账套接收成功');
  },

  // 账套接收-拒绝
  async refuse(payload) {
    await services.refuse(payload);
    this.updateAccountReceiveDatas();
    message.success('拒绝成功');
  },

  // 获取历史接收记录列表
  async $getHistoricalReceptionList(payload = {}) {
    const {
      historicalReception,
      historicalReception: {
        pagination,
        pagination: { current, pageSize },
      },
    } = this.getState();
    const params = {
      current,
      pageSize,
      ...payload,
    };
    const data = await services.getHistoricalReceptionList(params, {
      errMsg: '获取历史接收记录列表失败！',
    });

    const { list, total } = data || {};
    this.updateState({
      historicalReception: {
        ...historicalReception,
        dataSource: list,
        pagination: {
          ...pagination,
          total,
          current: params.current,
          pageSize: params.pageSize,
        },
      },
    });
  },
};
