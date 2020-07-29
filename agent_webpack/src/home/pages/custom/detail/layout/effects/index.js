import { router } from 'nuomi';
import { request } from 'nuijs';

export default {
  async initData() {
    const {
      query: { tab },
    } = router.location();
    const res = await request.sync('/instead/company/showNewTip.do');
    const newFuncTip = res.newFunction;

    // string 1=基本信息; 2=税务信息; 3=开票信息; 4=服务信息; 5=附件管理;
    const url = [
      'customer_detail_basicInfo/initData',
      'customer_detail_taxInfo/initData',
      'customer_detail_invoiceInfo/initData',
      'customer_detail_serviceInfo/initData',
      'custom_detail_attachment/initData',
    ][Number(tab) - 1];
    this.updateState({
      tabType: tab,
      taxGuideVisible: newFuncTip && newFuncTip.taxplan_guide === 'show',
    });
    // 等nuomi子组件渲染后
    setTimeout(() => {
      this.dispatch({
        type: url,
      });
    });
  },
};
