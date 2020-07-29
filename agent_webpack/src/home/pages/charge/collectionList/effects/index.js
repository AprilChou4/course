// import { omit } from 'lodash';
import { message } from 'antd';
// import Item from 'antd/lib/list/Item';
import services from '../services';

export default {
  // 请求收款单列表
  async $getReceiveBillList() {
    const { tableConditions } = this.getState();
    const data =
      (await services.getReceiveBillList(tableConditions, {
        loading: '正在获取收款单列表...',
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
      // pageSize: tableConditions.pageSize,
      ...tableConditions,
      current: 1,
      ...payload,
    };

    this.updateState({
      tableConditions: lastConditions,
      selectedRowKeys: [],
      selectedRows: [],
    });
    await this.$getReceiveBillList();
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
   * 删除收款单
   * @param {*} receiveBillIds 收款单id
   */
  async $deleteReceiveBill(payload) {
    await services.deleteReceiveBill(payload, {
      status: {
        300: (res) => {
          message.warning('该收款单对应的应收单已完成收款，无法删除');
          this.updateCondition();
          // if (payload.receiveBillIds.length === 1) {
          //   message.warning('该收款单对应的应收单已完成收款，无法删除');
          //   this.updateCondition();
          // } else {
          //   this.updateState({
          //     delFailData: res.data,
          //     delFailVisible: true,
          //   });
          // }
        },
      },
    });
    message.success('收款单已删除');
    this.updateCondition();
  },

  async initData() {
    await this.$getReceiveBillList();
    this.$getTreeData();
  },
};
