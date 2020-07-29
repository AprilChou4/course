import { createServices } from '@utils';
import mock from './mock';

export default createServices({
  getTimingList: 'instead/v2/message/timing/list.do::postJSON', // 定时消息列表
  deleteTiming: 'instead/v2/message/timing/delete.do::postJSON', // 删除定时消息
  getSuccessList: 'instead/v2/message/send/success/list.do::postJSON', // 成功消息列表
  getFailedList: 'instead/v2/message/send/failed/list.do::postJSON', // 失败消息列表
  getDetail: 'instead/v2/message/send/successfailed/detail.do::postJSON', // 成功失败消息详情
  sendCheck: 'instead/v2/message/send/check.do::postJSON', // 发送消息校验
  msgResend: 'instead/v2/message/reSend.do::postJSON', // 重新发送消息
  ignoreFailed: 'instead/v2/message/send/failed/ignored.do::postJSON', // 忽略发送失败消息
  getRedDot: 'instead/v2/message/record/redDot.do', // 消息记录失败红点
  getCurrentMessage: 'instead/v2/message/timing/detail::postJSON', // 获取当前编辑的详细资料

  // ...mock,
});
