import { createServices } from '@utils';

export default createServices({
  getShouldReceiveBillList:
    'http://192.168.206.92:3000/mock/584/instead/v2/customer/receipt/shouldReceiveBill/list.do::post', // 获取应收单列表
  deleteShouldReceiveBill:
    'http://192.168.206.92:3000/mock/584/instead/v2/customer/receipt/shouldReceiveBill/delete.do::postJSON', // 删除应收单
  getReceiveBillPlanList:
    'http://192.168.206.92:3000/mock/584/instead/v2/customer/receipt/shouldReceiveBill/plan.do::post', // 获取收款计划表
  getStaffList: 'http://192.168.206.92:3000/mock/516/instead/v2/user/staff/listServiceStaff.do', // 根据部门id查询员工集合 制单人/业务员/收款人
  getDeptList: 'instead/v2/user/dept/list.do', // 查询部门树
  getChargingItem: 'instead/contract/getChargingItem.do', // 获取服务项目
});
