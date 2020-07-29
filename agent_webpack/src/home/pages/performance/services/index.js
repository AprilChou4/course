import { createServices } from '@utils';

export default createServices({
  getList: 'instead/v2/user/performance/list::postJSON', // 表格的list
  getDepList: 'instead/v2/user/dept/list::get', // 部门树的list
});
