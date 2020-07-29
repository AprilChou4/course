import { createServices } from '@utils';
// import mock from './mock';

export default createServices({
  getTaxInfo: 'instead/v2/customer/tax/get', // 客户税务信息详情
  getTaxList: 'instead/v2/customer/tax/list::post', // 客户税务集合
  updateTax: 'instead/v2/customer/tax/update::postJSON', // 更新客户税务信息
  getLoginType: '/instead/v2/customer/tax/loginType::post', // 根据区域code获取登陆方式
  getCompanySetting: 'instead/v2/user/basicSetting/company/get.do::post', // 获取公司基础设置
  // ...mock,
});
