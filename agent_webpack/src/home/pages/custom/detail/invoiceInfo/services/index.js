import { createServices } from '@utils';
// import mock from './mock';

export default createServices({
  getInvoiceInfo: 'instead/v2/customer/invoice/get', // 客户开票信息详情
  updateInvoice: 'instead/v2/customer/invoice/update::postJSON', // 修改客户开票信息
  validateStatus: 'instead/v2/customer/agent/status/query::postJSON', // 查询代理关系验证状态
  saveCreditCode: 'instead/v2/customer/agent/updateSocialCode::postJSON', // 保存统一社会信用码
  sendMessageCode: 'instead/v2/customer/agent/messageCode/send::postJSON', // 获取验证码
  validateMessageCode: 'instead/v2/customer/agent/status/verify.do::postJSON', // 获取验证码
  // ...mock,
});
