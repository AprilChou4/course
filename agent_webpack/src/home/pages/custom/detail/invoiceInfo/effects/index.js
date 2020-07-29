import { router } from 'nuomi';
import { message } from 'antd';
import ShowConfirm from '@components/ShowConfirm';
import services from '../services';

export default {
  // 客户开票信息详情
  async $getInvoiceInfo() {
    const { customerId, isEdit } = router.location().query || {};
    let data = await services.getInvoiceInfo(
      {
        customerId,
      },
      {
        loading: '正在获取开票信息...',
      },
    );
    data = data || {};
    this.updateState({
      formParams: data,
      isEditing: Boolean(+isEdit),
      isShowAgentRelation: data.billingMethod === 1,
      agentStatus: data.agentStatus,
      initialBillingMethod: data.billingMethod,
    });
  },

  // 修改客户开票信息
  async updateInvoice(noRefresh) {
    const { customerId } = router.location().query || {};
    const { formParams } = this.getState();
    const data = await services.updateInvoice(
      {
        ...formParams,
        customerId,
      },
      {
        loading: '正在保存',
      },
    );
    if (!data) {
      this.updateState({
        isContChange: false,
      });
      // todo 如果开票方式纸电一体有错误信息弹窗，保存成功不提示
      if (!this.noMessage) {
        message.success('开票信息保存成功');
      }
      this.noMessage = false;
      // 切换tab时（onleave），不需要再次请求当前tab
      !noRefresh && this.$getInvoiceInfo();
    }
  },

  // 离开的时候
  async onLeave() {
    const { isEditing, isContChange } = this.getState();
    if (!isEditing || !isContChange) {
      return true;
    }
    return new Promise((resolve) => {
      ShowConfirm({
        title: '提示',
        content: '当前页面内容未保存，是否离开？',
        okText: '保存',
        cancelText: '离开',
        onOk: async () => {
          await this.updateInvoice(true);
          resolve(true);
        },
        onCancel() {
          resolve(true);
        },
      });
    });
  },

  // 纸电一体要校验（补充税号、资质检验
  async validateStatus() {
    const { customerId } = router.location().query || {};
    const params = { customerId, agentType: 2 };
    try {
      const data = await services.validateStatus(params);
      this.updateState({
        isShowAgentRelation: true,
        agentStatus: data.agentStatus,
      });
    } catch (err) {
      if (/^9\d+$/.test(err.status)) {
        return {
          errCode: err.status,
          errMsg: err.message,
        };
      }
    }
  },

  // 保存税号
  async saveCreditCode(payload) {
    const { customerId } = router.location().query || {};
    const params = { customerId, ...payload };
    const data = await services.saveCreditCode(params);
    if (data === null) {
      this.updateState({
        // isShowAgentRelation: true,
        isShowCreditCodeModal: false,
      });
    }
  },

  // 发送验证码
  async $sendMessageCode() {
    const { customerId } = router.location().query || {};
    const params = { customerId, agentType: 2 };
    try {
      const data = await services.sendMessageCode(params);
      this.updateState({
        agentStatus: 1,
      });
      message.warn(data);
    } catch (err) {
      if (/^9\d+$/.test(err.status)) {
        return {
          errCode: err.status,
          errMsg: err.message,
        };
      }
    }
  },

  // 校验验证码
  async validateMessageCode() {
    const { customerId } = router.location().query || {};
    const { verificationCode } = this.getState();
    const params = { customerId, agentType: 2, messageCode: verificationCode };
    try {
      await services.validateMessageCode(params);
      this.updateState({
        verificationCode: '',
      });
      return null;
    } catch (err) {
      if (/^9\d+$/.test(err.status)) {
        // 标志位：校验出错，保存开票信息时，不再弹窗
        this.noMessage = true;

        return {
          errCode: err.status,
          errMsg: err.message,
        };
      }
    }
  },

  async initData() {
    await this.$getInvoiceInfo();
  },
};
