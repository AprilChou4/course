import { get, trim } from '@utils';
import services from '../services';

export default {
  async initialQuery() {
    const params = { init: true };
    await this.query(params);
  },

  // 主页面相关查询接口集合
  async query(payload) {
    await this.$query(payload);
  },

  // 查询员工列表
  // 当需要重置分页时，传init，比如输入框搜索
  async $query(args = {}) {
    const { query, pagination, name } = this.getState();
    const { init, ...payload } = args;
    const params = {
      ...query,
      name: trim(name) || undefined,
      ...payload,
      ...(init ? { current: 1 } : {}),
    };
    const data = await services.getStaffList(params).catch(() => {});

    const list = get(data, 'list', []);
    const total = get(data, 'total', 0);
    this.updateState({
      query: params,
      staffList: list,
      pagination: {
        ...pagination,
        total,
        current: params.current,
        pageSize: params.pageSize,
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
};
