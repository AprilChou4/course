import { omit } from 'lodash';
import { store } from 'nuomi';
import { message } from 'antd';
import { get } from '@utils';
import services from '../services';

export default {
  // 获取应收单列表
  async $getShouldReceiveBillList() {
    const { tableConditions } = this.getState();
    const data =
      (await services.getShouldReceiveBillList(tableConditions, {
        loading: '正在获取应收单列表...',
      })) || {};
    this.updateState({
      tableList: data.list || [],
      total: data.count || 0,
      totalMoney: data.totalMoney || {},
    });
  },

  // 修改筛选条件
  async updateCondition(payload = {}) {
    const { tableConditions } = this.getState();
    const lastConditions = {
      pageSize: tableConditions.pageSize,
      current: 1,
      ...payload,
    };
    this.updateState({
      tableConditions: lastConditions,
      selectedRowKeys: [],
      selectedRows: [],
    });
    await this.$getShouldReceiveBillList();
  },

  // 根据部门id查询员工集合
  async $getStaffList() {
    const aList = await services.getStaffList();
    return aList || [];
  },

  // 查询部门树
  async $getDeptList() {
    const aList = await services.getDeptList();
    return aList || [];
  },
  // 获取服务项目
  async $getChargingItem() {
    const data = await services.getChargingItem();
    let aList = [];
    data.forEach(({ chargingItemList }) => {
      aList = [...aList, ...chargingItemList];
    });
    return aList || [];
  },

  // 列表初始化查询：服务类型、部门、
  async $getTreeData() {
    const [deptList, staffList, chargeItemList] = await Promise.all([
      this.$getDeptList(),
      this.$getStaffList(),
      this.$getChargingItem(),
    ]);

    this.updateState({
      deptList,
      staffList,
      chargeItemList,
    });
  },
  /**
   * 删除应收单
   * @param {*} shouldReceiveBillIds 应收单单id
   */
  async $deleteShouldReceiveBill(payload) {
    await services.deleteShouldReceiveBill(payload, {
      status: {
        400: (res) => {
          // message.warning('此应收单已被参照生成收款单，无法删除');
          this.updateState({
            delFailData: res.data,
            delFailVisible: true,
          });
        },
      },
    });
    message.success('应收单已删除');
    this.updateCondition();

    // 如果删除的删除的应收单已经打开了，清空应收单页面
    const receivableStore = store.getStore('receivable');
    const shouldReceiveId = get(
      receivableStore && receivableStore.getState(),
      'formInitialValues.shouldReceiveId',
    );
    if (shouldReceiveId && get(payload, 'shouldReceiveIds', []).includes(shouldReceiveId)) {
      receivableStore.dispatch({
        type: 'handleNewReceivable',
      });
    }
    // const { tableConditions } = this.getState();
    // this.updateState({
    //   tableConditions: {
    //     ...tableConditions,
    //   },
    //   selectedRowKeys: [],
    //   selectedRows: [],
    // });
    // await this.$getShouldReceiveBillList();
  },

  // // 导出Excel文件
  // async exportExcel() {
  //   const { tableConditions } = this.getState();
  //   const params = omit(tableConditions, ['current', 'pageSize']);
  //   const query = Object.keys(params).reduce((r, c) => `${r}&${c}=${params[c]}`, '');
  //   const url = `/instead/v2/user/performance/export.do?${query.substring(1)}`;
  //   window.open(url);
  // },

  async initData() {
    await this.$getShouldReceiveBillList();
    this.$getTreeData();
  },
};
