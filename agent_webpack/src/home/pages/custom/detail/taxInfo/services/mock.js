export default {
  getTaxInfo() {
    return {
      status: 200,
      data: {
        // 基本信息
        taxType: 1,
        competentTaxAuthorities: 'mock主管税务机关',
        enterprisesNature: 3,
        areaCode: '341521',
        areaName: '浙江-杭州市-上城区',
        // 登录信息
        loginType: 1,
        username: '用户名登录的用户名',
        usernameTaxTray: '金税盘的用户名',
        password: 'password',
        passwordCa: 'passwordCa',
        passwordTaxControl: 'passwordTaxControl',
        passwordTaxTray: 'passwordTaxTray',
        // 经办人信息
        agent: '超强',
        agentPhone: '18604560543',
        agentId: '230229199609044116',
        // 财务报表信息 (纳税期限 == 申报周期 ?)
        financialStatementsType: 3,
        applyPeriod: 2,
        isReclass: 1,
        // 税种信息
        customerTaxRelationList: [
          {
            customerId: 0,
            taxInfoId: 1,
            taxCycle: 1,
          },
        ],
        // 专管员联系方式 (备注没有)
        commissioner: 'mock专管员',
        commissionerPhone: '18604560543',
        commissioneraddress: '金色西溪A座',
      },
    };
  },
  getTaxList() {
    return {
      status: 200,
      data: [
        {
          default: true,
          relationTaxId: 1,
          taxCycle: 1,
          taxInfoId: 1,
          taxName: '税种名称1',
        },
        {
          default: true,
          relationTaxId: 2,
          taxCycle: 2,
          taxInfoId: 2,
          taxName: '税种名称2',
        },
        {
          default: true,
          relationTaxId: 3,
          taxCycle: 1,
          taxInfoId: 3,
          taxName: '税种名称3',
        },
      ],
    };
  },
  updateTax() {
    return {
      status: 200,
      data: null,
    };
  },
};
