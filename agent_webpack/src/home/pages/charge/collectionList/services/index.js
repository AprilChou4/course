import { createServices } from '@utils';

export default createServices({
  getReceiveBillList: 'instead/v2/customer/receipt/receiveBill/list.do::postJSON', // 获取收款单列表
  deleteReceiveBill: 'instead/v2/customer/receipt/receiveBill/delete.do::postJSON', // 删除收款单
  getStaffList: 'instead/v2/user/staff/listServiceStaff.do', // 根据部门id查询员工集合 制单人/业务员/收款人
  getDeptList: 'instead/v2/user/dept/list.do', // 查询部门树
  getChargingItem: 'instead/contract/getChargingItem.do', // 获取服务项目
});
