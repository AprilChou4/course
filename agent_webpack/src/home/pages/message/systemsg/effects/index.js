import { message } from 'antd';
import services from '../services';

export default {
  /**
   * 系统消息列表
   * @param {*} payload
   */
  async $getSystemsgList(payload) {
    const { current, pageSize, query } = this.getState();
    const { notice, total } = await services.getSystemsgList({
      current,
      pageSize,
      ...payload,
    });
    this.updateState({
      dataSource: notice,
      selectedRowKeys: [],
      selectedRows: [],
      total,
    });
  },
  // 消息类型 0-系统消息 1-辅助核算提醒 2-固定资产提醒 3-外币核算提醒 4-待接收帐套提醒 5-帐套交接更新提醒 6-工作提醒（云代账到期提醒） 7-合同到期提醒 8-合同欠款提醒 9-派工消息 10-建议反馈消息提醒 11-客户跟进系统消息.

  /**
   * 更新系统消息状态==标记为已读
   * @param {*} noticeIds
   */
  async $updateNotice(payload = {}) {
    const { current, pageSize, query } = this.getState();
    const data = await services.updateNotice({
      ...payload,
    });
    this.$getNotReadNum();
    this.$getSystemsgList({
      ...query,
    });
    this.updateState({
      selectedRowKeys: [],
      selectedRows: [],
    });
  },

  /**
   * 查询未读消息数量
   */
  async $getNotReadNum(payload) {
    const { suggestNum, noticeNum, logNum } = await services.getNotReadNum({
      ...payload,
    });
    this.updateState({
      suggestNum,
      noticeNum,
      logNum,
    });
  },

  /**
   * 我的提问列表
   */
  async $getQuesList() {
    const { current, pageSize } = this.getState();
    const { suggest, total } = await services.getQuesList({
      current,
      pageSize,
    });
    this.updateState({
      dataSource: suggest,
      total,
    });
  },

  /**
   * 我的提问详情
   * @param {String} *suggestId 建议反馈ID
   */
  async $getQuesDetail(payload) {
    const data = await services.getQuesDetail({
      ...payload,
    });
    this.updateState({
      quesDetail: data,
    });
  },

  /**
   * 操作日志列表
   * @param {String} *searchContent  操作对象或操作内容
   */
  async $getLogList(payload) {
    const { current, pageSize } = this.getState();
    const { operateLogs, total } = await services.getLogList({
      current,
      pageSize,
      ...payload,
    });
    this.updateState({
      dataSource: operateLogs,
      total,
    });
  },

  /**
   * 提交建议反馈
   * @param {String} *title 标题
   * @param {String} *content 内容
   * @param {file} *msgId files
   * @param {String} *contact 联系方式
   */
  async $submitAdvise(payload) {
    await services.submitAdvise({
      ...payload,
    });
    this.updateState({
      selectedRowKeys: [],
    });
  },

  // 获取系统消息详情
  async getNoticeDetail({ noticeId, ...rest }) {
    try {
      const data = await services.getNoticeDetail({ noticeId });
      this.updateState({
        ...rest,
        currSysMsgDetail: { ...data },
      });
      this.$updateNotice({
        noticeIds: noticeId,
      });
    } catch (error) {
      message.error('获取消息详情失败！');
    }
  },

  async initData(payload) {
    await this.$getSystemsgList({
      ...payload,
    });
    this.$getNotReadNum();
  },
};
