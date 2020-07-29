// issues: #120036
import pubData from 'data';

// 税种id对应的名字
export const TAX_MAP = {};
TAX_MAP[(TAX_MAP['增值税'] = 1)] = '增值税';
TAX_MAP[(TAX_MAP['城建税'] = 2)] = '城建税';
TAX_MAP[(TAX_MAP['教育费附加'] = 3)] = '教育费附加';
TAX_MAP[(TAX_MAP['地方教育费附加'] = 4)] = '地方教育费附加';
TAX_MAP[(TAX_MAP['印花税'] = 5)] = '印花税';
TAX_MAP[(TAX_MAP['企业所得税（查账征收）'] = 6)] = '企业所得税（查账征收）';
TAX_MAP[(TAX_MAP['水利建设基金'] = 7)] = '水利建设基金';
TAX_MAP[(TAX_MAP['文化事业建设税'] = 8)] = '文化事业建设税';
TAX_MAP[(TAX_MAP['其他收入-工会经费'] = 9)] = '其他收入-工会经费';
TAX_MAP[(TAX_MAP['残疾人就业保障金'] = 11)] = '残疾人就业保障金';
TAX_MAP[(TAX_MAP['社保'] = 12)] = '社保';
TAX_MAP[(TAX_MAP['企业所得所（核定征收）'] = 13)] = '企业所得所（核定征收）';
TAX_MAP[(TAX_MAP['水利建设专项收入'] = 14)] = '水利建设专项收入';
TAX_MAP[(TAX_MAP['个税'] = 15)] = '个税';

// 需要根据纳税人性质设置默认值的税种id
export const vatTypeTaxIds = [1, 9, 10, 11, 5, 14];
// 默认是季报的
export const seasonTaxIds = [6, 13];
// 默认是月报的
export const monthTaxIds = [12];
// 附加税ids，需与增值税(1)始终保持一致
export const additionalTaxIds = [2, 3, 4, 7];

// 获取附加税ids，传入地区，只有青岛的水利建设跟增值税有关
export const getAdditionalIds = (areaName) => {
  if (areaName.includes('青岛')) {
    return [2, 3, 4, 7];
  }
  return [2, 3, 4];
};

// 传入taxInfoId, 纳税种类, 附加税申报周期, 地区名称
// 增值申报周期 (附加税ids，需与增值税(1)始终保持一致)
/**
 * 征收项目与纳税期限对应关系（2019.8.20内容调整）
 * 增值税、残疾人就业保障金、其他收入-工会经费、其他收入-工会经费筹备金、印花税 初始值根据纳税人性质设置：小规模纳税人或空默认季报、一般纳税人默认月报 ，可修改。
 * 企业所得税默认季报，可修改为月；
 * 社保默认月报，不可修改。
 * 附加税（城建税、教育费附加、地方教育附加、水利建设基金（暂仅山东地区出现该选项，其他地区无该选项））、文化事业建设税与增值税的申报周期必须保持一致
 * 当选择附加税时已选择了增值税，则附加税的纳税期限同增值税，
 * 若选择附加税时没有增值税做参考，则默认根据纳税人性质设置：小规模纳税人或空默认季报、一般纳税人默认月报 ，可修改。
 * 系统确定增值税和附加税、文化事业建设税只要修改了任意一个征收项目的申报周期，则同步修改其他相关税种的纳税期限
 */

export const getDefaultTaxCycle = (taxInfoId, vatType, addedTaxCycle, areaName) => {
  // 设置默认申报周期,
  let defaultValue = 1;
  // 只有青岛的水利建设跟增值税有关，其他地区按纳税性质
  if (!areaName.includes('青岛') && taxInfoId === 7) {
    return vatType === 0 ? 1 : 2;
  }
  if (vatTypeTaxIds.includes(taxInfoId)) {
    // 小规模纳税人或空默认季报、一般纳税人默认月报
    defaultValue = vatType === 0 ? 1 : 2;
  } else if (seasonTaxIds.includes(taxInfoId)) {
    // 默认是季报的
    defaultValue = 2;
  } else if (monthTaxIds.includes(taxInfoId)) {
    // 默认是月报的
    defaultValue = 1;
  } else if (additionalTaxIds.includes(taxInfoId)) {
    // 不存在增值税，就按照纳税性质
    const vatTypeDefault = vatType === 0 ? 1 : 2;
    defaultValue = addedTaxCycle || vatTypeDefault;
  }

  return defaultValue;
};

// 不支持该税种id的地区, 不存在key代表都支持
export const noSupportTaxAreaMap = {
  '7': ['浙江'],
};
