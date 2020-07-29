import { createServices } from '@utils';
import mock from './mock';

export default createServices({
  getSystemsgList: 'instead/v2/message/system/getNoticeList.do::postJSON', // 系统消息列表
  getNoticeDetail: 'instead/v2/message/system/getNoticeDetail::postJSON', // 获取系统消息详情
  getNotReadNum: 'instead/v2/message/system/getNotReadNum.do::postJSON', // 查询未读消息数量(新
  updateNotice: 'instead/v2/message/system/updateNotice.do::postJSON', // 更新系统消息状态=标记为已读
  getQuesList: 'instead/v2/message/system/getSuggestList.do::postJSON', // 我的提问列表
  getQuesDetail: 'instead/v2/message/system/getSuggest.do::postJSON', // 查询建议反馈详情
  getLogList: 'instead/v2/message/system/operate/log/list.do::postJSON', // 操作日志列表
  submitAdvise: 'instead/v2/message/system/addSuggest.do::post', // 提交建议反馈

  getSuccessList: 'instead/v2/message/send/success/list.do::postJSON', // 成功消息列表

  getDetail: 'instead/v2/message/send/successfailed/detail.do::postJSON', // 成功失败消息详情
  sendCheck: 'instead/v2/message/send/check.do::postJSON', // 发送消息校验
  msgResend: 'instead/v2/message/reSend.do::postJSON', // 重新发送消息
  ignoreFailed: 'instead/v2/message/send/failed/ignored.do::postJSON', // 忽略发送失败消息
  getRedDot: 'instead/v2/message/record/redDot.do', // 消息记录失败红点

  // ...mock,
});
