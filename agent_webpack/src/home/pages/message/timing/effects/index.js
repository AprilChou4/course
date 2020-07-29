import services from '../services';

export default {
  async $getList() {
    const data = await services.getList();
    this.updateState({
      dataSource: data,
    });
  },
  async initData() {
    await this.$getList();
  },
};
