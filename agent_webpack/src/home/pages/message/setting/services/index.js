import { createServices } from '@utils';

export default createServices({
  getTemplateList: 'instead/v2/message/template/search', // 获取消息模板列表
  editTemplate: 'instead/v2/message/template/update::postJSON', // 修改消息模板
  addTemplate: 'instead/v2/message/template/add::postJSON', // 新增消息模板
  checkTemplate: 'instead/v2/message/duplicateSensitive/check::postJSON', // 检查重复/敏感词
  getGroupList: 'instead/v2/message/customer/group/search::postJSON', // 获取客户分组列表
  getBuiltInGroupList: 'instead/v2/message/customer/group/classify/search', // 获取内置客户分组
  getCustomerList: 'instead/v2/message/customer/classify/search::postJSON', // 获取客户
  editDefaultGroup: 'instead/v2/message/customer/group/default/update::postJSON', // 编辑内置客户分组
  deleteGroup: 'instead/v2/message/customer/group/delete::postJSON', // 删除自定义客户分组
  addGroup: 'instead/v2/message/customer/group/add::postJSON', // 新增自定义客户分组
  updateGroup: 'instead/v2/message/customer/group/update::postJSON', // 修改自定义客户分组
});
