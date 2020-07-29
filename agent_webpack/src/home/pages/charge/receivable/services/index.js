import { createServices } from '@utils';

export default createServices({
  addReceivable: 'instead/v2/customer/receipt/shouldReceiveBill/add::postJSON', // 添加应收单
  updateReceivable: 'instead/v2/customer/receipt/shouldReceiveBill/update::postJSON', // 更新应收单
  deleteReceivable: 'instead/v2/customer/receipt/shouldReceiveBill/delete::postJSON', // 删除应收单
  getReceivableInfo: 'instead/v2/customer/receipt/shouldReceiveBill/get::postJSON', // 查询应收单信息
  getServiceItemSamePeriod:
    'instead/v2/customer/receipt/shouldReceiveBill/getServiceItemSamePeriod::postJSON', // 获取客户对应服务项目已经添加过的服务期间
});
