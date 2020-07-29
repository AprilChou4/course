import { createServices } from '@utils';

export default createServices({
  addDept: 'instead/v2/user/dept/add::postJSON', // 新增部门
  editDept: 'instead/v2/user/dept/update::postJSON', // 编辑部门
  deleteDept: 'instead/v2/user/dept/delete::post', // 删除部门
  getStaffList: 'instead/v2/user/staff/list::postJSON', // 查询在职员工列表
  addStaff: 'instead/v2/user/staff/add::postJSON', // 新增员工
  editStaff: 'instead/v2/user/staff/update::postJSON', // 修改员工
});
