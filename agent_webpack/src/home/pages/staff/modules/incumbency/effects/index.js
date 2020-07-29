import { message } from 'antd';
import globalServices from '@home/services';
import commonServices from '@pages/staff/services';
import { ShowConfirm } from '@components';
import { get, trim, treeSearch } from '@utils';
import services from '../services';

export default {
  async initQuery() {
    const params = { init: true };
    await this.query(params);
  },

  // 主页面相关查询接口集合
  async query(payload = {}) {
    const { initDept, ...rest } = payload;
    // init是初始化表格（分页变成第一页），initDept是初始化部门（部门变成第一个）
    this.getRolesList();
    await this.getDeptList({ initDept });
    await this.$query(rest);
  },

  // 查询部门列表
  async getDeptList(payload = {}) {
    const { initDept, ...params } = payload;
    const data = await globalServices.getDeptList(params);
    const { curDeptKey } = this.getState();
    const changes = {};

    // 更新curDeptKey和curDeptNodes
    if (initDept || !curDeptKey) {
      changes.curDeptKey = get(data, '[0].deptId');
      changes.curDeptNodes = get(data, '[0]');
    } else if (curDeptKey) {
      changes.curDeptNodes = treeSearch({ children: data }, curDeptKey, {
        targetPropName: 'deptId',
      });
    }
    this.updateState({
      deptList: data || [],
      ...changes,
    });
    return data;
  },

  // 查询员工列表
  // 当需要重置分页时，传init，比如输入框搜索
  async $query(args = {}) {
    const { query, filters = {}, pagination = {}, name, curDeptKey } = this.getState();
    const { init, roleIds, ...payload } = args;
    const params = {
      ...query,
      name: trim(name) || undefined,
      deptId: curDeptKey,
      ...payload,
      roleIds: roleIds && Array.isArray(roleIds) && roleIds.length ? roleIds : undefined,
      ...(init ? { current: 1 } : {}),
    };
    const data = await services.getStaffList(params).catch(() => {});

    const list = get(data, 'list', []);
    const total = get(data, 'total', 0);
    // 更新查询条件
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

  // 显示新增部门弹窗
  async showAddDeptModal(payload = {}) {
    const { curDeptKey } = this.getState();
    const { data = {} } = payload;
    const count = await globalServices.getDeptCount();
    if (count >= 1000) {
      message.warning('抱歉，部门数量已达到最大限制');
      return;
    }

    this.updateState({
      addDeptModal: {
        visible: true,
        data: { curDeptKey, ...data },
      },
    });
  },

  // 关闭新增部门弹窗
  hideAddDeptModal(payload = {}) {
    const { data = {} } = payload;
    this.updateState({
      addDeptModal: {
        visible: false,
        data,
      },
    });
  },

  // 新增部门
  async $addDept(payload = {}) {
    const data = await services.addDept(payload, {
      loading: '正在新增部门...',
      successMsg: '部门信息已保存',
    });
    this.hideAddDeptModal();
    await this.query();
  },

  // 显示编辑部门弹窗
  showEditDeptModal(payload = {}) {
    const { curDeptKey, curDeptNodes } = this.getState();
    const { data = {} } = payload;
    this.updateState({
      editDeptModal: {
        visible: true,
        data: { curDeptKey, curDeptNodes, ...data },
      },
    });
  },

  // 关闭编辑部门弹窗
  hideEditDeptModal(payload = {}) {
    const { data = {} } = payload;
    this.updateState({
      editDeptModal: {
        visible: false,
        data,
      },
    });
  },

  // 编辑部门
  async $editDept(payload = {}) {
    await services.editDept(payload, {
      loading: '正在修改部门...',
      successMsg: '部门信息已保存',
    });
    this.hideEditDeptModal();
    await this.query();
  },

  // 删除部门
  async $deleteDept(payload = {}) {
    await services.deleteDept(payload, {
      loading: '正在删除部门...',
      successMsg: '部门已删除',
      status: {
        300(res) {
          ShowConfirm({
            title: res.message || '',
            type: 'warning',
          });
        },
      },
    });
    // 删除部门后定位到第一个部门
    await this.query({ init: true, initDept: true });
  },

  // 显示新增/修改员工弹窗
  showAddEditStaffModal(payload = {}) {
    const { curDeptKey, curDeptNodes } = this.getState();
    const { data = {} } = payload;
    this.updateState({
      addEditStaffModal: {
        visible: true,
        data: { curDeptKey, curDeptNodes, ...data },
      },
    });
  },

  // 关闭新增/修改员工弹窗
  hideAddEditStaffModal(payload = {}) {
    const { data = {} } = payload;
    this.updateState({
      addEditStaffModal: {
        visible: false,
        data,
      },
    });
  },

  // 显示管理员修改自己员工信息弹窗
  showAdminEditSelfModal(payload = {}) {
    const { data = {} } = payload;
    this.updateState({
      adminEditSelfModal: {
        visible: true,
        data,
      },
    });
  },

  // 关闭管理员修改自己员工信息弹窗
  hideAdminEditSelfModal(payload = {}) {
    const { data = {} } = payload;
    this.updateState({
      adminEditSelfModal: {
        visible: false,
        data,
      },
    });
  },

  // 新增员工
  async $addStaff(payload = {}) {
    const { formValues } = payload;
    await services.addStaff(formValues, {
      loading: '正在新增员工...',
      successMsg: '员工已新增',
    });
    this.hideAddEditStaffModal();
    await this.query();
  },

  // 修改员工
  async $editStaff(payload = {}) {
    const { staffModalType, formValues } = payload;
    await services.editStaff(formValues, {
      loading: '正在修改员工...',
      successMsg: '员工信息修改成功',
    });
    if (staffModalType === 3) {
      this.hideAdminEditSelfModal();
    } else {
      this.hideAddEditStaffModal();
    }
    await this.query();
  },

  // 查看是否有派工信息
  async getCustomerAssignStatistics(payload = {}) {
    const { staffId } = payload;
    const data = await globalServices.getCustomerAssignStatistics({ staffId }).catch(() => {});
    const filteredData = get(data, '[0]') ? data.filter((item) => item && item.roleType !== 0) : [];
    return filteredData;
  },

  // 处理停用员工逻辑
  async handleStopStaff(payload = {}) {
    const { record = {} } = payload;
    const { staffId } = record;
    // 先查看是否有派工信息(屏蔽任务类型为"添加人"的)，有的话不停用，弹窗显示派工信息
    const data = await this.getCustomerAssignStatistics({ staffId });
    if (data && data.some(({ count }) => count > 0)) {
      this.showStopStaffModal({
        data: {
          record,
          assignStatistics: data,
        },
      });
      return;
    }
    await this.$stopStaff({ staffId });
  },

  // 显示停用员工弹窗
  showStopStaffModal(payload = {}) {
    const { data = {} } = payload;
    this.updateState({
      stopStaffModal: {
        visible: true,
        data,
      },
    });
  },

  // 关闭停用员工弹窗
  hideStopStaffModal(payload = {}) {
    const { data = {} } = payload;
    this.updateState({
      stopStaffModal: {
        visible: false,
        data,
      },
    });
  },

  // 更新停用员工弹窗
  async updateStopStaffModal() {
    const { stopStaffModal = {} } = this.getState();
    const modalData = get(stopStaffModal, 'data', {});
    const staffId = get(modalData, 'record.staffId', '');
    const data = await this.getCustomerAssignStatistics({ staffId });
    this.updateState({
      stopStaffModal: {
        ...stopStaffModal,
        data: {
          ...modalData,
          assignStatistics: data,
        },
      },
    });
  },

  // 停用员工
  async $stopStaff(payload = {}) {
    const staffId =
      payload.staffId || get(this.getState(), 'stopStaffModal.data.record.staffId', '');
    if (!staffId) {
      message.error('员工id不存在');
      return;
    }

    await commonServices.stopStaff(
      { staffId },
      {
        loading: '正在停用员工...',
        successMsg: '停用成功',
      },
    );
    this.hideStopStaffModal();
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

  // 校验手机号对应用户的申请状态(-1未激活,0已启用,1停用,2未申请,3待审批)
  async getApplyStatus(payload) {
    const data = await globalServices.getApplyStatus(payload);
    return data;
  },

  // 获取员工信息
  async getStaffInfo(payload) {
    const data = await globalServices.getStaffInfo(payload);
    return data;
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
