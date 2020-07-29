import { message } from 'antd';
import ShowConfirm from '@components/ShowConfirm';
import React from 'react';
import services from '../services';

export default {
  // 定时消息
  async $getTimingList(payload) {
    const { current, pageSize, query } = this.getState();
    const { messageTimings, total } = await services.getTimingList({
      current,
      pageSize,
      ...payload,
    });
    this.updateState({
      dataSource: messageTimings,
      selectedRowKeys: [],
      total,
    });
  },

  /**
   * 删除定时消息
   * @param {Number} *msgId 定时消息id

   */
  async $deleteTiming(payload) {
    await services.deleteTiming({
      ...payload,
    });
    this.updateState({
      selectedRowKeys: [],
    });
  },

  // 成功列表
  async $getSuccessList(payload) {
    const { current, pageSize } = this.getState();
    const { successList, total } = await services.getSuccessList({
      current,
      pageSize,
      ...payload,
    });
    this.updateState({
      dataSource: successList,
      total,
    });
  },

  /**
   * 失败列表
   * @param {Boolean} *isIgnore 是否已忽略 默认未忽略
   */
  async $getFailedList(payload) {
    const { current, pageSize, query, isIgnore } = this.getState();
    const { failedList, total } = await services.getFailedList({
      current,
      pageSize,
      isIgnore,
      ...payload,
    });
    this.updateState({
      dataSource: failedList,
      total,
    });
  },

  /**
   * 消息记录红点
   */
  async $getRedDot() {
    const { redCount } = await services.getRedDot();
    this.updateState({
      redCount,
    });
  },

  /**
   * 成功失败消息详情
   * @param {Number} *msgId 消息id
   * @param {Number} *realSendTime 实际发送时间
   * @param {String} customerName 客户名称
   * @param {Boolean  } isRead 成功的列表中，是否已读 true - 已读 false - 未读
   * @param {Number} failedReasonCode  失败原因 1-客户未授权查账 2-客户停止服务 3-无发送权限 4-网络异常
   */
  async $getDetail(payload) {
    const data = await services.getDetail({
      ...payload,
    });
    this.updateState({
      detailInfo: data.detail || {},
    });
    return data;
  },

  /**
   * 发送消息校验
   * @param {Array} *sendObjects 发送对象  sendObjects=[{customerId:'', grantUserIds:[]}]
   * @param {String} *customerId 客户id
   * @param {Array} *grantUserIds 客户关联的人员ids
   *
   * @param {Number} *msgId 消息id
   * @param {String} *msgTile 消息标题
   * @param {String} *msgContent 消息内容
   * @param {Number} *sendTime 发送时间
   * @param {String} msgTemplateId 消息模板id

   *
   */
  async $sendCheck(payload) {
    try {
      const data = await services.sendCheck({
        ...payload,
      });
      this.updateState({});
      return data;
    } catch (err) {
      message.error(err.message);
    }
  },

  /**
   * 重新发送消息
   * @param {Array} *sendObjects 发送对象  sendObjects=[{customerId:'', grantUserIds:[]}]
   * @param {String} *customerId 客户id
   * @param {Array} *grantUserIds 客户关联的人员ids
   *
   * @param {Number} *msgId 消息id
   * @param {String} *msgTile 消息标题
   * @param {Number} *sendTime 发送时间
   * @param {String} *recordIds 消息模板id
   * @param {String} msgTemplateId 消息模板id

   *
   */
  async $msgResend(payload) {
    try {
      const data = await services.msgResend({
        ...payload,
      });
      this.updateState();
      return data;
    } catch (err) {
      if (err.status === 906) {
        ShowConfirm({
          title: err.message,
          content: (
            <span>
              您可以在<span style={{ color: '#008CFF' }}>【消息记录-发送失败】</span>
              中查看已发送的消息
            </span>
          ),
        });
      }
    }
  },

  /**
   * 忽略发送失败消息
   * @param {Number} *msgId 消息id
   * @param {Number} *realSendTime 实际发送时间
   */
  async $ignoreFailed(payload) {
    const data = await services.ignoreFailed({
      ...payload,
    });
    this.updateState();
  },

  // 请求当前要编辑的详细信息
  async getCurrentMessage(msgId) {
    const data = await services.getCurrentMessage({ msgId });
    this.updateState({
      currentEditMessage: data.detail,
      displayType: 1, // 1是展示编辑页面
    });
  },

  async initData(payload) {
    await this.$getTimingList({
      ...payload,
    });
    this.$getRedDot();
  },

  // 发送消息
  async sendMessage(params) {
    try {
      const res = await services.sendMessage(params);
      this.updateState({});
      return res;
    } catch (err) {
      return err;
    }
  },

  // 更新定时消息
  async updateMessage() {
    const res = await services.updateMessage();
    this.updateState({});
    return res;
  },
};
