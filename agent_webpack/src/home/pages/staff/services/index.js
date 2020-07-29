import { createServices } from '@utils';

export default createServices({
  getReviewNum: 'instead/v2/user/staff/review/getReviewNum::post', // 获取待审批与已停用的员工数量
  export: 'instead/v2/user/staff/export::post', // 员工导出
  stopStaff: 'instead/v2/user/staff/stop::post', // 停用员工
  deleteStaff: 'instead/v2/user/staff/delete::post', // 删除员工
});
