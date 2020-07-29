export default {
  getBasicInfo({ customerId }) {
    return {
      status: 200,
      data: {
        // 基本信息 todo：营改增企业
        customerId,
        customerCode: 'kh202005-0792',
        customerName: 'mock客户名称',
        unifiedSocialCreditCode: '91310118748097906B',
        vatType: 0,
        industryTypeParent: '建筑业',
        industryType: '水源及供水设施工程建筑',
        isProductOil: 0,
        isForeignTrade: 1,
        // 工商信息
        registrationType: 4,
        representative: 'mock法人代表',
        registeredCapital: 4000,
        establishmentDate: 1566355099587,
        registrationAuthority: 'mock登记机关',
        registrationAddress: 'mock注册地址',
        businessScope: 'mock经营范围',
        // 股东信息
        customerShareholderInfoList: [
          {
            shareholder: 'mock股东名称',
            shareholderType: 1,
            shareholderCertificateType: 1,
            certificateNum: '230229199609044116',
            subscriptionAmount: 15000,
            reallyInvestmentAmount: 13000,
            capitalContributionsType: '货币',
            capitalContributionsAmount: 40000,
            capitalContributionsDate: 1566355099587,
            reallyInvestType: '土地使用权',
            reallyInvestAmount: 70000,
            reallyInvestDate: 1566355099587,
          },
        ],
      },
    };
  },
  updateInfo() {
    return {
      status: 200,
      data: null,
    };
  },
  searchCustomer() {
    return {
      status: 200,
      data: [
        {
          customerName: 'mock1号客户',
          unifiedSocialCreditCode: '33011111122222021607',
        },
        {
          customerName: 'mock2号客户',
          unifiedSocialCreditCode: '330111AE2202SD1607',
        },
        {
          customerName: 'mock3号客户',
          unifiedSocialCreditCode: '330AD11111asd122222SE027',
        },
      ],
    };
  },
};
