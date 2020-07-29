// 客户管理列表
import React from 'react';
import effects from './effects';
import Main from './components/Main';
/**
 * sort: 0, 建账期间排序，默认倒序
 * sortByCode:0  客户编码排序
 */
const sorters = JSON.parse(localStorage.getItem('CUSTOM_COLUMN_SORT')) || {};

export default {
  id: 'custom_inService',
  state: {
    // string 1=服务中客户; 2=停止服务客户
    tabType: '1',
    // =========服务中==========
    // 当前页码
    current: 1,
    // 数据总数
    total: 0,
    // 每页显示数量
    pageSize: 20,
    // 查询参数
    query: {},
    // 排序==> 头部的筛选统一放在sorter
    sorters,
    // 表格数据
    dataSource: [],
    // 表格选中数据
    selectedRowKeys: [],
    selectedRows: [],
    // 列表操作行
    currRecord: {},
    // 自定义排序列
    columnSource: [],
    // 部门数据
    deptList: [],
    // 记账会计
    bookeepers: [],
    // 会计助理=2
    accountAssistant: [],
    // 报税会计=4
    taxReporter: [],
    // 开票员=3=树结构
    drawerList: [],
    // 客户顾问=5
    customAdviser: [],
    // 开票员非树结构,用于表格头部筛选
    headDrawerList: [],
    // 查询未停用的员工集合
    staffList: [],
    // 所有员工合集
    allEmployeeList: [],
    // 服务类型列表
    serviceTypeList: [],
    // 指派弹窗显示/隐藏
    assignVisible: false,
    // =======================新增客户=============
    // 新增客户弹窗
    customVisible: false,
    // 新增客户编码
    addCustomerCode: '',
    // 新增客户弹窗tab
    // customTabKey: '1',
    // 普通新增>服务类型组合
    // serviceRelationList: [],
    // 识别返回的数据
    // scanInfo: {},
    // 识别新增>需要提交的数据
    scanSubData: {},
    // =====================批量导入===============
    // 批量导入弹窗
    batchVisible: false,
    // 点击第三方导入弹窗
    thirdImportVisible: false,
    // 点击第三方导入+按Ctrl 弹窗
    thirdCtrlVisible: false,
    // 第三方导入>选择客户弹窗
    selectCustomVisible: false,
    // 第三方导入>选择客户弹窗>可选客户列表
    // selectCustomList: [],
    // 第三方导入>导入进度条是否显示、可用来判断是否可操作
    importProgressVisible: false,
    // 第三方导入>导入结果弹窗
    importResultVisible: false,
    // 第三方导入进度
    thirdProgressPercent: 0,
    // 完成状态 -1=未开始 0=创建中 1=部分完成，状态为success 2=完成
    thirdProgressStatus: 0,
    // // 导入状态
    // thirdProgressStatus:false,
    // 导入授权码弹窗
    authCodeVisible: false,
    // 批量导入弹窗>失败记录弹窗
    batchFailVisible: false,
    // 停止客户弹窗
    stopVisible: false,
    // 建账弹窗
    accountVisible: false,
    // excel建账失败路径
    excelFailPath: '',
    // excel建账失败检查
    excelFailVisible: false,
    // excel建账失败检查上层数据
    excelFailData: {},
    // 开户确认弹窗
    openAccountVisible: false,
    // 跟进弹窗
    isFollowVisible: false,
    // 是否还有更多数据
    isFollowHasMore: true,
    // 跟进列表
    followList: [],
    // 跟进列表总数
    followListTotal: 0,
    // 跟进列表当前页
    followCurrent: 1,
    // 跟进列表每页显示数量
    followPageSize: 20,
    // 跟进编辑模块
    editFollowItem: {},
  },
  effects,
  render() {
    return <Main />;
  },
  onInit() {
    this.store.dispatch({
      type: 'initData',
    });
  },
};
