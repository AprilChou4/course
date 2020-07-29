import { message } from 'antd';
import services from '../services';

export default {
  // 更新回收站列表
  updateTable(payload = {}) {
    const { table } = this.getState();
    this.updateState({
      table: {
        ...table,
        ...payload,
      },
    });
  },

  // 刷新回收站列表和账套列表
  async updateAllTables(init) {
    const { table } = this.getState();
    this.updateState({
      table: {
        ...table,
        ...(init ? { selectedRowKeys: [] } : {}),
      },
    });
    this.dispatch({
      type: 'account/updateMainDatas',
    });
    this.$getRecycleBinList();
  },

  // 获取回收站列表
  async $getRecycleBinList(payload = {}) {
    const {
      query,
      table,
      table: { pagination },
    } = this.getState();
    const params = {
      ...query,
      ...payload,
    };
    const data = await services.getRecycleBinList(params, { errMsg: '获取回收站账套列表失败！' });

    const { list, total } = data || {};
    this.updateState({
      query: params,
      table: {
        ...table,
        dataSource: list,
        pagination: {
          ...pagination,
          total,
          current: params.current,
          pageSize: params.pageSize,
        },
      },
    });
  },

  // 恢复账套
  async recover(payload) {
    try {
      const data = await services.recover(payload, { returnAll: true, status: { 400: () => {} } });
      this.updateAllTables(true);
      message.success('恢复成功！');
      return data;
    } catch (error) {
      if (error.status === 400) {
        return error;
      }
    }
  },

  // 查询未建账客户
  async getUnCreateCustomer(payload) {
    const data = await services.getUnCreateCustomer(payload, {
      errMsg: '查询未建账客户列表失败！',
    });
    return data;
  },

  // 删除账套
  async delete(payload = {}) {
    await services.delete(payload.list);
    this.updateAllTables(true);
    message.success('删除成功！');
  },

  // // 批量删除账套
  // batchDelete() {
  //   const {
  //     table: { selectedRowKeys },
  //   } = this.getState();
  //   if (!selectedRowKeys.length) {
  //     message.warning('请选择要删除的帐套');
  //     return;
  //   }
  //   this.delete({
  //     list: selectedRowKeys,
  //   });
  // },
};
