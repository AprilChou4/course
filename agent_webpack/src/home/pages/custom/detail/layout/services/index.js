import { createServices } from '@utils';
import mock from './mock';

export default createServices({
  getTimingList: 'instead/message/timing/list.do::post', // 服务中客户列表
  getSuccessList: 'instead/message/send/success/list.do::post', // 成功消息列表
  updateCustomerStatus: 'instead/customer/updateCustomerStatus.do', // 更新客户状态=>恢复服务
  ...mock,
});
