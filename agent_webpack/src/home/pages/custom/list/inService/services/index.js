import { createServices } from '@utils';
import mock from './mock';

export default createServices({
  serviceCustomerList: 'instead/v2/customer/list.do::postJSON', // 服务中客户列表
  updateCustomerStatus: 'instead/customer/updateCustomerStatus.do', // 更新客户状态=>恢复服务

  getHeaderColumn: 'instead/v2/customer/header/list.do', // 查询客户自定义列表表头信息
  updateHeaderColumn: 'instead/v2/customer/header/update.do::postJSON', // 修改客户自定义列表表头信息
  getServiceType: 'instead/v1/user/base/archives/servicetype/list.do', // 查询客户自定义列业务类型信息
  getDeptList: 'instead/v2/user/dept/list.do', // 查询部门树
  getBookkeep: 'instead/v2/user/staff/bookkeep/list.do', // 查询记账会计集合
  getRoletypeList: 'instead/v2/user/staff/role/list.do', // 查询派工角色信息(树结构)，包括开票员等
  getHeadDrawerList: 'instead/v2/user/staff/drawer/list.do', // 查询开票员集合,非树

  deleteCustomer: 'instead/v2/customer/delete.do::postJSON', // 删除客户
  stopCustomer: 'instead/v2/customer/stop.do::postJSON', // 停止客户
  getCustomerCode: 'instead/v2/customer/code.do', // 获取客户编码
  checkCustomerCode: 'instead/v2/customer/checkSameCode.do::post', // 检验客户编码重复
  checkCustomerName: 'instead/v2/customer/checkSameName.do::post', // 检验客户名称重复
  searchCustomerByName: 'instead/v2/customer/searchByName.do', // 根据客户名称模糊匹查询客户信息
  addCustomer: 'instead/v2/customer/add.do::postJSON', // 新增客户-普通新增
  getScanInfo: 'instead/v2/customer/getScan.do::post', // 新增客户 -识别新增 > 获取营业执照信息
  scanAddCustomer: 'instead/v2/customer/scanAdd.do::postJSON', // 新增客户-识别新增
  deleteCode: 'instead/v2/customer/deleteCode.do', // 回收客户编码

  // customerImport: 'instead/v2/customer/import.do', // 客户导入>新增客户下的批量导入
  assignCustomer: 'instead/v2/customer/assign.do::postJSON', // 派工
  getAssignInfo: 'instead/v2/customer/getAssign.do::postJSON', // 获取派工前信息
  checkAssign: 'instead/v2/customer/checkAssign.do::postJSON', // 派工前校验派工是否存在已删除情况
  checkCustomer: 'instead/v2/customer/check.do::post', // 检验客户是否存在已删除账套
  checkSocialCode: 'instead/v2/customer/checkSocialCode.do::post', // 检验客户社会信用码是否存在
  updateSocialCode: 'instead/v2/customer/updateSocialCode.do::post', // 修改客户社会信用码
  // 跟进信息 customer-follow-controller
  addFollow: 'instead/v2/customer/follow/add.do::postJSON', // 添加客户跟进信息
  delFollow: 'instead/v2/customer/follow/delete.do::post', // 删除客户跟进信息
  getFollowList: 'instead/v2/customer/follow/list.do::postJSON', // 查询客户跟进信息
  updateFollow: 'instead/v2/customer/follow/update.do::postJSON', // 修改客户跟进信息
  getStaffList: 'instead/v2/user/staff/normal/list.do', // 查询未停用的员工集合 用于跟进人等
  getAllEmployeeList: 'instead/v2/user/staff/getAllEmployee', // 查询所有员工集合

  // 建账相关
  getAccountInfo: 'instead/v2/customer/account/get.do', // 根据客户id或者账套id查询账套信息
  createNewAccount: 'instead/v2/customer/account/create.do::postJSON', // 新建账套
  offlineImportAccount: 'jz/cloud/forwardInterface/importAccinfo.do::post', // 第三方线下建账
  getThirdImportStatus: 'jz/cloud/forwardInterface/getImportTaskStatus.do', // 获取线下/线上建账进度
  onlineImportAccount: 'jz/cloud/forwardInterface/importAccountInfo.do::post', // 第三方线上建账
  getImportWebType: 'jz/cloud/forwardInterface/getImportWebType.do::post', // 第三方建账线上软件名称
  querySubjectTemplateList: 'instead/subjectTemplate/querySubjectTemplateList.do', // 会计科目模板
  importExcel: 'jz/cloud/forwardInterface/importExcel.do::post', // excel建账
  copyAccount: 'instead/v2/customer/account/copy.do::post', // 复制账套
  copyAccountProcess: 'instead/v2/customer/account/copyProcess.do::post', // 账套复制进度
  getListAccount: 'instead/v2/customer/account/listAccount.do', // 查询用户所有账套

  // ==============记账相关接口============
  getBatchImportWebType: 'jz/cloud/forwardInterface/getBatchImportWebType.do::post', // 获取软件类型
  getInfoByAccount: 'jz/cloud/forwardInterface/getInfoByAccount.do::post', // 第三方导入获取账套列表/第三方线上建账
  getImportedCustom: 'jz/cloud/forwardInterface/getUserInfo.do::post', // // 第三方导入>获取已导入客户的名称集合
  webBatchImport: 'jz/cloud/forwardInterface/webBatchImport::post', //  第三方导入
  getTaskStatus: 'jz/cloud/forwardInterface/getTaskStatus.do', // 第三方导入>导入进度(webBatchImport后调用)
  getThirdImportResult: 'jz/cloud/forwardInterface/getBatchImportTaskInfo.do', // 第三方导入>导入结果
  deleteBatchImportTask: 'jz/cloud/forwardInterface/deleteBatchImportTask.do::post', // 关闭任务后，请求列表接口
  judgeBatchImportTask: 'jz/cloud/forwardInterface/judgeBatchImportTask.do::post', // 如果成功 出现 进度条， 判断 userid 是否相同， 不同则不展示操作按钮
  // ...mock,
});
