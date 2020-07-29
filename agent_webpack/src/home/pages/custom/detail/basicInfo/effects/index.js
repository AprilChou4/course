import { message } from 'antd';
import { router } from 'nuomi';
import ShowConfirm from '@components/ShowConfirm';
import services from '../services';

export default {
  // 获取客户基础信息详情
  async $getBasicInfo() {
    const { customerId, isEdit } = router.location().query || {};
    const data = await services.getBasicInfo(
      {
        customerId,
      },
      {
        loading: '正在获取基本信息...',
      },
    );
    this.updateState({
      formParams: data,
      isEditing: Boolean(+isEdit),
      shareholderList: data.customerShareholderInfoList, // 将股东信息单独拿出来，防止重复渲染。
    });
  },

  // 获取公司基础设置，判断是否开启国票通道 申报通道方式（0税务筹划平台；1国票）
  async $getCompanySetting() {
    const data = await services.getCompanySetting();
    this.updateState({
      isNationalTicket: data.declareWay === 1,
    });
  },
  // 保存
  async updateInfo(noRefresh) {
    const { shareholderList, formParams } = this.getState();
    const { customerId } = router.location().query || {};
    const params = {
      customerId,
      ...formParams,
      customerShareholderInfoList: shareholderList,
    };
    const result = await services.updateInfo(params, {
      loading: '正在保存',
      status: {
        400: () => {
          ShowConfirm({
            type: 'warning',
            content: '亲，检测到您填写的税局登录信息有误，为保证申报功能正常使用，请仔细检查。',
          });
        },
      },
    });
    if (!result) {
      this.updateState({
        isContChange: false,
      });
      message.success('基本信息保存成功');
      !noRefresh && this.$getBasicInfo();
    }
  },

  // 根据名称查找客户
  async searchCustomer(customerName) {
    const data = await services.searchCustomer({
      customerName,
    });
    this.updateState({
      customerOptions: data,
    });
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
          await this.updateInfo(true);
          resolve(true);
        },
        onCancel() {
          resolve(true);
        },
      });
    });
  },

  async initData(payload) {
    this.updateState({
      key: new Date().getTime(),
    });
    await this.$getCompanySetting();
    await this.$getBasicInfo(payload);
  },
};
