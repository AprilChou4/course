import { omit } from 'lodash';
import services from '../services';

export default {
  // 请求表格列表
  async $getList() {
    const { tableConditions } = this.getState();
    const data = await services.getList(tableConditions);
    this.updateState({
      tableList: data.list,
      total: data.total,
    });
  },
  // 请求部门树列表
  async getDepList() {
    const data = await services.getDepList();
    const { tableConditions } = this.getState();
    this.updateState({
      tableConditions: {
        ...tableConditions,
        deptId: data[0].deptId,
      },
    });
  },

  // 修改筛选条件
  async updateCondition(payload) {
    const { tableConditions } = this.getState();
    const lastConditions = {
      ...tableConditions,
      current: 1,
      ...payload,
    };
    this.updateState({
      tableConditions: lastConditions,
    });
    await this.$getList();
  },

  // 导出Excel文件
  async exportExcel() {
    const { tableConditions } = this.getState();
    const params = omit(tableConditions, ['current', 'pageSize']);
    const query = Object.keys(params).reduce((r, c) => `${r}&${c}=${params[c]}`, '');
    const url = `/instead/v2/user/performance/export.do?${query.substring(1)}`;
    window.open(url);
  },

  async initData() {
    await this.getDepList();
    await this.$getList();
  },
};
