import { createServices } from '@utils';

export default createServices({
  getStaffList: 'instead/v2/user/staff/review/list::postJSON', // 查询待审批员工列表
  approveStaff: 'instead/v2/user/staff/review/approved::postJSON', // 员工审批通过
  rejectStaff: 'instead/v2/user/staff/review/refuse::post', // 拒绝员工
});
