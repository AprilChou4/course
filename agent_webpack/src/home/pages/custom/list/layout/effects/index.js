import services from '../services';

export default {
  // 服务中客户列表
  async $serviceCustomerList(payload) {
    const { current, pageSize } = this.getState();
    const data = await services.serviceCustomerList({
      current,
      pageSize,
      ...payload,
    });
    this.updateState({
      dataSource: data.list,
      total: data.total,
    });
  },

  // 停止服务客户列表
  async $stopCustomerList(payload) {
    const { currentStop, pageSizeStop } = this.getState();
    const data = await services.stopCustomerList({
      current: currentStop,
      pageSize: pageSizeStop,
      ...payload,
    });
    this.updateState({
      dataSourceStop: data.list,
    });
  },

  // 初始化数据
  async initData() {},
};
