import { createServices } from '@utils';
import mock from './mock';

export default createServices({
  getReceiptNo: 'instead/v2/customer/receipt/receiveBill/getReceiptNo::get', // 获取收款单编号
  addCollection: 'instead/v2/customer/receipt/receiveBill/add::postJSON', // 新增收款单
  deleteOne: 'instead/v2/customer/receipt/receiveBill/delete::postJSON', // 删除收款单
  updateOne: 'instead/v2/customer/receipt/receiveBill/update::postJSON', // 更新收款单
  getDetail: 'instead/v2/customer/receipt/receiveBill/get::get', // 查看收款单
  getReceiptType: 'instead/v1/user/companySet/receipt/type/query::get', // 获取收款方式列表
  getCustomer: 'instead/receipt/getCustomerList::get', // 获取客户
  getCharging: 'instead/contract/getChargingItem::get', // 获取服务项目
  getStaff: 'instead/v2/user/staff/listServiceStaff::get', // 根据部门id查询员工集合 | 收款人
  getCustomerBillList: 'instead/v2/customer/receipt/shouldReceiveBill/listCustomerBillNO::get', // 获取客户对应的应收单
  getplanDetailList: 'instead/v2/customer/receipt/shouldReceiveBill/plan::postJSON', // 收款计划明细表
  refrenceYsd: 'instead/v2/customer/receipt/shouldReceiveBill/planDetailByIds::postJSON', // 参照应收单获取收款项目明细
  getMaxMoney: 'instead/v2/customer/receipt/receiveBill/getPreReceiveMoney::get',
  // ...mock,
});
