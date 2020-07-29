import globalServices from '@home/services';
import { get } from '@utils';
import services from '../services';

export default {
  // 主页面相关查询接口集合
  async query() {
    this.getReviewNum();
  },

  // 获取待审批与已停用的员工数量
  async getReviewNum(payload) {
    const data = await services.getReviewNum(payload);
    this.updateState({
      moduleCounts: {
        pending: get(data, 'reviewNum', 0),
        unpassed: get(data, 'noPassNum', 0),
      },
    });
  },

  // 员工导出
  async export(payload) {
    await services.export(payload, { loading: '正在导出员工...' });
  },

  // 校验手机号对应用户的申请状态(-1未激活,0已启用,1停用,2未申请,3待审批)
  async getApplyStatus(payload) {
    const data = await globalServices.getApplyStatus(payload);
    return data;
  },

  // 获取员工信息
  async getStaffInfo(payload) {
    const data = await globalServices.getStaffInfo(payload);
    return data;
  },
};
