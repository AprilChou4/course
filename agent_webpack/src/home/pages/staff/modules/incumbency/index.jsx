/**
 * 部门员工-在职
 */
import React from 'react';
import Main from './components/Main';
import effects from './effects';

const defaultCurrent = 1;
const defaultPageSize = 20;

export default {
  id: 'staff_incumbency',
  state: {
    // 部门列表
    deptList: [],
    // 当前选中的部门key
    curDeptKey: undefined,
    // 当前选中的部门数据
    curDeptNodes: {},
    // 员工表格数据
    staffList: [],
    // 员工表格筛选
    filters: {},
    // 员工表格分页
    pagination: {
      total: 0, // 数据总数
      current: defaultCurrent, // 当前页
      pageSize: defaultPageSize, // 每页条数
    },
    // 表格查询参数
    query: {
      current: defaultCurrent,
      pageSize: defaultPageSize,
    },
    // 顶部搜索框的值
    name: '',
    rolesList: [],
    // 添加部门弹窗
    addDeptModal: {
      visible: false,
      data: { curDeptKey: '' },
    },
    // 编辑部门弹窗
    editDeptModal: {
      visible: false,
      data: { curDeptKey: '', curDeptNodes: {} },
    },
    // 新增/修改员工弹窗
    addEditStaffModal: {
      visible: false,
      data: { curDeptKey: '' },
    },
    // 管理员修改自己员工信息弹窗
    adminEditSelfModal: {
      visible: false,
      data: {},
    },
    // 停用员工弹窗
    stopStaffModal: {
      visible: false,
      data: {},
    },
    // 导入相关
    batchVisible: false,
    batchFailVisible: false,
  },
  effects,
  render() {
    return <Main />;
  },
  onInit() {
    this.store.dispatch({
      type: 'initQuery',
    });
  },
};
