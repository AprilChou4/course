import { createServices } from '@utils';
// import mock from './mock';

export default createServices({
  getUserInfo: 'instead/v2/user/getUserInfo', // 获取用户信息
  getAllEmployeeList: 'instead/v2/user/staff/getAllEmployee', // 查询所有员工集合
  getRolesList: 'instead/v2/user/role/getRoles::postJSON', // 获取角色列表
  getDeptList: 'instead/v2/user/dept/list', // 查询部门列表
  getAllDeptList: 'instead/v2/user/dept/listAll', // 查询完整部门树
  getApplyStatus: 'instead/v2/user/staff/getApplyStatus::post', // 校验手机号对应用户的申请状态(-1未激活,0已启用,1停用,2未申请,3待审批)
  getStaffInfo: 'instead/v2/user/staff/get', // 获取员工信息
  getCustomerAssignStatistics: 'instead/v2/user/staff/getCustomerAssignStatistics', // 统计员工派工信息
  getDeptCount: 'instead/v2/user/dept/getDeptCount', // 获取部门数量
  getCustomerList: 'instead/contract/getCustomerList', // 获取客户列表
  getCustomerBillNO: 'instead/v2/customer/receipt/shouldReceiveBill/listCustomerBillNO', // 获取客户对应的应收单
  getStaffList: 'instead/v2/user/staff/listServiceStaff', // 根据部门id查询员工集合
  getServiceItems: 'instead/contract/getChargingItem', // 获取服务项目
  getReceiptNo: 'instead/v2/customer/receipt/receiveBill/getReceiptNo', // 获取单据编号
  // ...mock,
});
