import { createServices } from '@utils';

export default createServices({
  getCollectPlanList: 'instead/v2/customer/receipt/shouldReceiveBill/plan.do::postJSON', // 收款计划表
  getCollectPlanDetailList: 'instead/v2/customer/receipt/shouldReceiveBill/planDetail.do::postJSON', // 收款计划明细表
});
