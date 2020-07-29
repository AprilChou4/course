import { createServices } from '@utils';
// import mock from './mock';

export default createServices({
  getAccountingList: 'instead/v2/user/staff/bookkeep/list', // 查询记账会计列表
  // getAccountingAssistantList: 'instead/v2/user/staff/role/list', // 查询会计助理列表
  getAccountingAssistantList: 'instead/customer/getStatementList', // 查询会计助理列表（旧）
  getCompanySetAuditing: 'instead/v1/user/companySet/auditing', // 查询是否开启审核
  getAccountList: 'instead/v2/customer/account/list::postJSON', // 查询账套列表
  getAccountStatistics: 'instead/v2/customer/account/statistics::post', // 统计数据总览
  getDate: 'instead/v2/customer/account/date', // 获取日期
  unlock: 'instead/v2/customer/account/unlock::postJSON', // 账套解锁
  getReceiptNum: 'instead/v2/customer/account/receive/count', // 统计待接收记录数
  editAccount: 'instead/v2/customer/account/update::postJSON', // 编辑账套
  deleteAccount: 'instead/v2/customer/account/delete::post', // 删除账套
  getAccountInfo: 'instead/v2/customer/account/get', // 查询账套信息
  getSubjectTemplateList: 'instead/subjectTemplate/querySubjectTemplateList', // 获取会计科目
  beforeCheck: 'instead/v2/customer/account/checkOut/check::postJSON', // 账套结账前提示信息
  checkOut: 'instead/v2/customer/account/checkOut/checkOut::postJSON', // 账套结账
  checkOutProcess: 'instead/v2/customer/account/checkOut/process::postJSON', // 账套结账进度
  beforeReview: 'instead/v2/customer/account/review/check::postJSON', // 账套审核前提示信息
  review: 'instead/v2/customer/account/review/review::postJSON', // 账套审核
  reviewProcess: 'instead/v2/customer/account/review/process::postJSON', // 账套审核进度
  // ...mock,
});
