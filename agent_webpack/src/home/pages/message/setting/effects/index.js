import services from '../services';

export default {
  // 获取消息模板列表
  async $getTemplateList() {
    const { templateInputVal } = this.getState();
    const data = await services.getTemplateList({
      templateTitle: templateInputVal || undefined,
    });
    this.updateState({
      templateList: data.msgTemplates,
    });
    return data;
  },

  // 获取客户分组列表
  async $getGroupList() {
    const { groupInputVal } = this.getState();
    const data = await services.getGroupList({
      groupName: groupInputVal,
    });
    this.updateState({
      groupList: data.customerGroups,
    });
  },

  // 获取预置客户分组列表
  async $getBuiltInGroupList() {
    const data = await services.getBuiltInGroupList();
    this.updateState({
      builtInGroupList: data.defaultGroups,
    });
  },

  // 获取客户列表
  async getCustomerList(params) {
    const { customerParams } = this.getState();
    const resParams = { ...customerParams, ...params };
    this.updateState({
      customerParams: resParams,
    });
    const { current, pageSize, customerName, queryCriteria } = resParams;
    const data = await services.getCustomerList({
      current,
      pageSize,
      customerName: queryCriteria.length ? undefined : customerName || undefined,
      queryCriteria: queryCriteria.length ? queryCriteria : undefined,
    });
    this.updateState({
      customerList: data.customers,
      customerTotal: data.total,
    });
  },

  // 编辑系统消息模板
  async $editTemplate(params) {
    try {
      await services.editTemplate(params, {
        status: {
          905: () => {},
        },
      });
      this.updateState({});
      return true;
    } catch (res) {
      return res;
    }
  },

  // 添加系统消息模板
  async $addTemplate(params) {
    try {
      await services.addTemplate(params, {
        status: {
          905: () => {},
        },
      });
      this.updateState({});
      return true;
    } catch (res) {
      // 重复的标题或敏感词
      return res;
    }
  },

  // 检验敏感词、重复
  async checkContent(params) {
    const res = await services.checkTemplate(params);
    this.updateState({});
    return res;
  },

  // 编辑默认客户分组
  async editDefaultGroup(types) {
    const res = await services.editDefaultGroup({ types });
    this.updateState({});
    return res;
  },

  // 删除客户分组
  async deleteGroup(groupId) {
    const res = await services.deleteGroup({ groupId });
    this.updateState({});
    return res;
  },

  // 增加客户分组
  async $addGroup({ title, customerIdList }) {
    try {
      const res = await services.addGroup({
        groupName: title,
        customerIdList,
      });
      return res;
    } catch (error) {
      return '添加失败';
    }
  },

  // 更新客户分组
  async $updateGroup({ groupId, title, customerIdList }) {
    try {
      const res = await services.updateGroup({
        groupId,
        groupName: title,
        customerIdList,
      });
      this.updateState({});
      return res;
    } catch (error) {
      return '更新失败';
    }
  },

  async initData() {
    await this.$getTemplateList();
  },
};
