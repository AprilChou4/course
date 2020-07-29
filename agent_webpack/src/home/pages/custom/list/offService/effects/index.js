import { message } from 'antd';
import { trim } from 'lodash';
import ShowConfirm from '@components/ShowConfirm';
import services from '../services';

export default {
  // 停止服务客户列表
  async $stopCustomerList(payload) {
    const { current, pageSize, query } = this.getState();
    const param = { current, pageSize, ...query, ...payload };
    const data = await services.stopCustomerList(param, {
      loading: '正在加载客户列表',
    });
    this.updateState({
      total: data.total,
      dataSource: data.list,
      current: param.current,
      pageSize: param.pageSize,
    });
  },

  /**
   * 恢复服务
   *  @param {*string}  bookkeepingAccounting 记账会计
   *  @param {*string}  customerId 客户id
   */
  async $renewCustomer(payload) {
    const { record, ...rest } = payload;
    const { total, pageSize, current } = this.getState();
    const maxPage = Math.ceil((total - 1) / pageSize) || 1;
    const data = await services.renewCustomer(rest, {
      status: {
        300: () => {
          this.updateState({
            currRecord: record,
            renewVisible: true,
          });
        },
      },
    });
    message.success('恢复成功');
    this.$stopCustomerList({
      current: current > maxPage ? maxPage : current,
    });
    this.updateState({
      renewVisible: false,
    });
    this.dispatch({
      type: 'custom_layout/updateState',
      payload: {
        isNeedRefresh: true,
      },
    });
    return data;
  },

  /** 删除客户
   * @param {*array}  客户id数组
   */
  async $deleteCustomer(payload) {
    const { record } = payload;
    const { total, pageSize, current } = this.getState();
    const maxPage = Math.ceil((total - 1) / pageSize) || 1;
    try {
      await services.deleteCustomer([record.customerId]);
      message.success('客户删除成功');
      this.$stopCustomerList({
        current: current > maxPage ? maxPage : current,
      });
      this.updateState({
        selectedRowKeys: [],
        selectedRows: [],
      });
    } catch (err) {
      if (err.status === 300) {
        message.destroy();
        const { createAccount, hasContract, hasInvoice, hasReceipt } = err.data;
        const reason = trim(`${createAccount.length ? '已建账、' : ''}
                              ${hasContract.length ? '已有合同、' : ''}
                              ${hasInvoice.length ? '已有开票、' : ''}
                              ${hasReceipt.length ? '已收费、' : ''}`);
        const { customerName } = record;
        ShowConfirm({
          title: `“${customerName}”客户因${reason.substring(0, reason.length - 1)}不能删除`,
          width: 346,
          type: 'warning',
          onOk: () => {
            this.dispatch({
              type: 'updateState',
              payload: {
                selectedRowKeys: [],
                selectedRows: [],
              },
            });
          },
        });
      }
    }
  },
  // 查询
  async $getTreeData() {
    const bookeepers = await services.getBookkeep(); // 查询记账会计

    this.updateState({
      bookeepers,
    });
  },
  // 初始化数据
  async initData() {
    await this.$stopCustomerList();
    this.$getTreeData();
  },
};
