import { createServices } from '@utils';

export default createServices({
  getReceiveBillList:
    // 'http://192.168.206.92:3000/mock/584/instead/v2/customer/follow/list.do::post',
    'http://192.168.206.92:3000/mock/584/instead/v2/customer/receipt/receiveBill/list.do::post', // 获取收款单列表
  deleteReceiveBill:
    'http://192.168.206.92:3000/mock/584/instead/v2/customer/receipt/receiveBill/delete.do::postJSON', // 删除收款单
  getStaffList: 'http://192.168.206.92:3000/mock/516/instead/v2/user/staff/listServiceStaff.do', // 根据部门id查询员工集合 制单人/业务员/收款人
  getDeptList: 'instead/v2/user/dept/list.do', // 查询部门树
  getChargingItem: 'instead/contract/getChargingItem.do', // 获取服务项目
});
