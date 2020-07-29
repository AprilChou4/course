import { createServices } from '@utils';

export default createServices({
  getShouldReceiveBillList: 'instead/v2/customer/receipt/shouldReceiveBill/list.do::postJSON', // 获取应收单列表
  deleteShouldReceiveBill: 'instead/v2/customer/receipt/shouldReceiveBill/delete.do::postJSON', // 删除应收单
  getReceiveBillPlanList: 'instead/v2/customer/receipt/shouldReceiveBill/plan.do::postJSON', // 获取收款计划表
  getStaffList: 'instead/v2/user/staff/listServiceStaff.do', // 根据部门id查询员工集合 制单人/业务员/收款人
  getDeptList: 'instead/v2/user/dept/list.do', // 查询部门树
  getChargingItem: 'instead/contract/getChargingItem.do', // 获取服务项目
});
