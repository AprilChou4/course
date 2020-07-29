import { createServices } from '@utils';
import mock from './mock';

export default createServices({
  getAccountingList: 'instead/v2/user/staff/bookkeep/list', // 查询记账会计列表
  // 账套移交
  checkUser: 'instead/v2/user/staff/check', // 账套移交-查询接收人
  getAllAccounts: 'instead/v2/customer/account/all', // 账套移交-查询用户所有非交接中的账套
  transfer: 'instead/v2/customer/account/transfer/transfer::postJSON', // 账套移交-移交
  getTransferingList: 'instead/v2/customer/account/transfer/list::postJSON', // 移交中列表
  withdraw: 'instead/v2/customer/account/transfer/updateStatus::post', // 账套移交-撤回
  getHistoricalTransferList: 'instead/v2/customer/account/transfer/historyList::postJSON', // 移交历史记录列表
  // 账套接收
  getToReceiveList: 'instead/v2/customer/account/receive/list::postJSON', // 待接收记录列表
  checkAccountName: 'instead/v2/customer/account/receive/check::post', // 账套接收-校验账套名称是否重复
  receive: 'instead/v2/customer/account/receive/receive::postJSON', // 接收
  refuse: 'instead/v2/customer/account/receive/updateStatus::post', // 拒绝
  getHistoricalReceptionList: 'instead/v2/customer/account/receive/historyList::postJSON', // 接收历史记录列表
  // ...mock,
});
