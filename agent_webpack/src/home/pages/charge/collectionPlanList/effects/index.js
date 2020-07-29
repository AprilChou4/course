import { router } from 'nuomi';
import services from '../services';

export default {
  // 获取收款计划表
  async $getCollectPlanList(payload = {}) {
    const {
      query: { shouldReceiveId },
    } = router.location();
    const data =
      (await services.getCollectPlanList(
        {
          shouldReceiveId,
          ...payload,
        },
        {
          loading: '正在获取收款计划列表...',
        },
      )) || {};
    this.updateState({
      planTableList: data.list || [],
      totalMoney: data.totalMoney || {},
      tableType: true,
      shouldReceiveBillData: data.shouldReceiveBill || {},
      query: payload,
    });
  },

  // 获取收款计划明细表
  async $getCollectPlanDetailList(payload = {}) {
    // const { tableConditions } = this.getState();
    const {
      query: { shouldReceiveId },
    } = router.location();
    const data =
      (await services.getCollectPlanDetailList(
        {
          shouldReceiveId,
          ...payload,
        },
        {
          loading: '正在获取收款计划明细列表...',
        },
      )) || {};
    this.updateState({
      detailTableList: data.list || [],
      totalMoney: data.totalMoney || {},
      shouldReceiveBillData: data.shouldReceiveBill || {},
      query: payload,
    });
  },

  // 修改筛选条件
  async updateCondition(payload = {}) {
    const { tableConditions } = this.getState();
    const lastConditions = {
      ...tableConditions,
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

  async initData() {
    await this.$getCollectPlanList();
  },
};
