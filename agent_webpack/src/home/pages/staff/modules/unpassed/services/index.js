import { createServices } from '@utils';

export default createServices({
  getStaffList: 'instead/v2/user/staff/review/failList::postJSON', // 查询未通过员工列表
});
