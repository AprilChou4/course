import { createServices } from '@utils';
import mock from './mock';

export default createServices({
  updateCustomerStatus: 'instead/customer/updateCustomerStatus.do', // 更新客户状态=>恢复服务

  deleteCustomer: 'instead/v2/customer/delete.do::postJSON', // 删除客户

  // ...mock,
});
