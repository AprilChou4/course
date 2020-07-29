import { createServices } from '@utils';

export default createServices({
  getStaffList: 'instead/v2/user/staff/stopList::postJSON', // 查询停用员工列表
  enableStaff: 'instead/v2/user/staff/enable::post', // 启用员工
  enableDept: 'instead/v2/user/staff/enableDept::postJSON', // 启用部门和员工
});
