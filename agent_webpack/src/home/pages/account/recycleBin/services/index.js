import { createServices } from '@utils';
// import mock from './mock';

export default createServices({
  getRecycleBinList: 'instead/v2/customer/account/recycle/list::postJSON', // 回收站账套列表
  recover: 'instead/v2/customer/account/recycle/renew::post', // 恢复账套
  delete: 'instead/v2/customer/account/recycle/delete::postJSON', // 账套删除
  getUnCreateCustomer: 'instead/v2/customer/listNotCreate', // 查询未建账客户
  // ...mock,
});
