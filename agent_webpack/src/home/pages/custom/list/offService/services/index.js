import { createServices } from '@utils';
import mock from './mock';

export default createServices({
  stopCustomerList: 'instead/v2/customer/stopList.do::postJSON', // 停止服务客户列表
  updateCustomerStatus: 'instead/customer/updateCustomerStatus.do', // 更新客户状态=>恢复服务
  getBookkeep: 'instead/v2/user/staff/bookkeep/list.do', // 查询记账会计集合
  deleteCustomer: 'instead/v2/customer/delete.do::postJSON', // 删除客户
  stopCustomer: 'instead/v2/customer/stop.do::postJSON', // 停止客户
  renewCustomer: 'instead/v2/customer/renew.do::post', // 恢复客户

  // ...mock,
});
