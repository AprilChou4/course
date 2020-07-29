import { createServices } from '@utils';
// import mock from './mock';

export default createServices({
  getBasicInfo: 'instead/v2/customer/get', // 客户基础信息详情
  updateInfo: 'instead/v2/customer/update::postJSON', // 客户基础信息详情
  searchCustomer: 'instead/v2/customer/searchByName', // 输入建议
  checkSameCode: 'instead/v2/customer/checkSameCode::post', // 检验客户编码重复
  checkSameName: 'instead/v2/customer/checkSameName::post', // 检验客户名称重复
  getCompanySetting: 'instead/v2/user/basicSetting/company/get.do::post', // 获取公司基础设置
  // ...mock,
});
