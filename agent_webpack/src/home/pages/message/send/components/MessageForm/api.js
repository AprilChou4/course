import request from '@utils/request';

// 获取消息模板
export const getTemplateList = () => {
  return request.get('instead/v2/message/template/list');
};

// 获取客户分组
export const getGroupList = (groupName) => {
  const url = 'instead/v2/message/customer/group/list';
  return request.postJSON(url, { groupName: groupName || undefined });
};

// 获取对应联系人列表
export const getCustomerList = ({ groupIds, queryCriteria, keyword }) => {
  return request.postJSON('instead/v2/message/customer/user/list', {
    groupIds: groupIds.length ? groupIds : undefined,
    queryCriteria: queryCriteria.length ? queryCriteria : undefined,
    username: keyword || undefined,
    customerName: keyword || undefined,
  });
};

// 检验敏感词
export const checkSensitive = (params) => {
  return request.postJSON('instead/v2/message/duplicateSensitive/check', params);
};

// 检验权限、服务
export const checkAuthorized = (params) => {
  return request.postJSON('instead/v2/message/send/check', params);
};

// 发送
export const sendMessage = (params) => {
  return request.postJSON('instead/v2/message/send', params);
};

// 编辑
export const updateMessage = (params) => {
  return request.postJSON('instead/v2/message/timing/update', params);
};
