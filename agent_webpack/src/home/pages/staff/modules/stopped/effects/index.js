import globalServices from '@home/services';
import commonServices from '@pages/staff/services';
import { message } from 'antd';
import { get, trim } from '@utils';
import services from '../services';

export default {
  async initialQuery() {
    const params = { init: true };
    await this.query(params);
  },

  // 主页面相关查询接口集合
  async query(payload) {
    this.getRolesList();
    await this.$query(payload);
  },

  // 查询员工列表
  // 当需要重置分页时，传init，比如输入框搜索
  async $query(args = {}) {
    const { query, filters = {}, pagination = {}, name } = this.getState();
    const { init, roleIds, ...payload } = args;
    const params = {
      ...query,
      name: trim(name) || undefined,
      ...payload,
      roleIds: roleIds && Array.isArray(roleIds) && roleIds.length ? roleIds : undefined,
      ...(init ? { current: 1 } : {}),
    };
    const data = await services.getStaffList(params).catch(() => {});

    const list = get(data, 'list', []);
    const total = get(data, 'total', 0);
    this.updateState({
      staffList: list,
      query: params,
      pagination: {
        ...pagination,
        total,
        current: params.current,
        pageSize: params.pageSize,
      },
      filters: {
        ...filters,
        roleIds: params.roleIds,
      },
    });
  },

  // 更新查询条件并查询
  async updateQuery(payload = {}) {
    // init为true
    const { query, init = true, ...params } = payload;
    // 更新条件与调接口分开，避免阻塞
    this.updateState(query);
    await this.query({
      init,
      ...params,
    });
  },

  // 显示员工启用弹窗
  showEnableStaffModal(payload = {}) {
    const { data = {} } = payload;
    this.updateState({
      enableStaffModal: {
        visible: true,
        data,
      },
    });
  },

  // 关闭员工启用弹窗
  hideEnableStaffModal(payload = {}) {
    const { data = {} } = payload;
    this.updateState({
      enableStaffModal: {
        visible: false,
        data,
      },
    });
  },

  // 启用员工
  async $enableStaff(payload = {}) {
    const { record = {} } = payload;
    const { staffId } = record;
    const data = await services.enableStaff(
      { staffId },
      {
        loading: '正在启用员工...',
      },
    );
    // data是false，表示原部门不存在，则需要弹窗重新选择部门
    if (!data) {
      this.showEnableStaffModal({ data: payload });
      return;
    }
    message.success('启用成功');
    await this.query();
  },

  // 启用员工2
  async $enableStaffPro(payload = {}) {
    await services.enableDept(payload, {
      loading: '正在启用员工...',
      successMsg: '启用成功',
    });
    this.hideEnableStaffModal();
    await this.query();
  },

  // 删除员工
  async $deleteStaff(payload = {}) {
    await commonServices.deleteStaff(payload, {
      loading: '正在删除员工...',
      successMsg: '员工已删除',
    });
    await this.query();
  },

  // 获取角色列表
  async getRolesList(payload) {
    const data = await globalServices.getRolesList(payload);
    this.updateState({
      rolesList: data.map(({ roleId, roleName }) => ({ text: roleName, value: roleId })),
    });
    return data;
  },
};
