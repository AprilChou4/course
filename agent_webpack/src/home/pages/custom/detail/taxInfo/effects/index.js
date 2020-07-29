import { router } from 'nuomi';
import { message } from 'antd';
import { pick } from 'lodash';
import ShowConfirm from '@components/ShowConfirm';
import services from '../services';
import { getProcessForm } from '../components/LoginForm/util';

export default {
  // 客户税务信息详情
  async $getTaxInfo() {
    const { customerId, isEdit } = router.location().query || {};
    const data = await services.getTaxInfo(
      {
        customerId,
      },
      {
        loading: '正在获取税务信息...',
      },
    );
    this.$getLoginType(data.areaCode);
    // 分成三个表单，登录方式(税务局/个税)、税种信息、其他
    const loginModeForm = pick(data, [
      'loginType',
      'username',
      'password',
      'passwordCa',
      'passwordTaxControl',
      'usernameTaxTray',
      'passwordTaxTray',
      'sMSVerificationUsername',
      'sMSVerificationPassword',
      'loginIdentity',
      'phoneNum',
      // #130119
      'personalIncomeTaxLoginType',
      'personalIncomeTaxPassword',
    ]);
    // 设置默认值（财务报表信息，纳税期限）
    // 财务报表类型不存在时，会计科目如果企业会计准则、或小企业会计准则，则作为默认值，否则默认值是空
    let defaultFinacial;
    if (data.accounting === 0 || data.accounting === 4) {
      defaultFinacial = 2;
    }
    if (data.accounting === 1 || data.accounting === 5) {
      defaultFinacial = 1;
    }

    // 纳税期限不存在时, 小规模纳税人默认季报, 一般纳税人默认月报
    let defaultApplyPeriod;
    if (data.vatType === 0) {
      defaultApplyPeriod = 2;
    } else if (data.vatType === 1) {
      defaultApplyPeriod = 1;
    }

    const getDefaultVal = (val, def) => (val && val >= 0 ? val : def);
    data.financialStatementsType = getDefaultVal(data.financialStatementsType, defaultFinacial);
    data.applyPeriod = getDefaultVal(data.applyPeriod, defaultApplyPeriod);

    this.updateState({
      formParams: data,
      isEditing: Boolean(+isEdit),
      formTaxList: data.customerTaxRelationList,
      loginModeForm,
    });
    await this.$getTaxList(data.areaCode);
  },

  // 获取公司基础设置，判断是否开启国票通道 申报通道方式（0税务筹划平台；1国票）
  async $getCompanySetting() {
    const data = await services.getCompanySetting();
    this.updateState({
      isNationalTicket: data.declareWay === 1,
    });
  },

  // 修改客户税务信息
  async updateTax(noRefresh) {
    const { formTaxList, formParams, loginModeForm } = this.getState();
    const { customerId } = router.location().query || {};

    let form = {
      ...formParams,
      taxType: formParams.taxType === null ? 0 : formParams.taxType,
      enterprisesNature: formParams.enterprisesNature || 8,
    };
    const processForm = getProcessForm(form, loginModeForm);
    // 电子税务局： 根据loginType，算出key，设置参数。
    form = processForm('loginType');
    form = processForm('personalIncomeTaxLoginType');
    const result = await services.updateTax(
      {
        customerId,
        ...form,
        customerTaxRelationList: formTaxList,
      },
      {
        loading: '正在保存',
        status: {
          400: () => {
            ShowConfirm({
              type: 'warning',
              content: '亲，检测到您填写的税局登录信息有误，为保证申报功能正常使用，请仔细检查。',
            });
          },
        },
      },
    );
    if (!result) {
      this.updateState({
        isContChange: false,
      });
      message.success('税务信息保存成功');
      !noRefresh && this.$getTaxInfo();
    }
  },

  // 税务信息集合
  async $getTaxList(areaCode) {
    const data = await services.getTaxList({
      areaCode,
    });
    const { formTaxList } = this.getState();
    // 税种信息过滤掉地区不支持的税种
    const finnalList = formTaxList.filter((item) => {
      const index = data.findIndex((tax) => tax.taxInfoId === item.taxInfoId);
      return index > -1;
    });
    this.updateState({
      taxList: data,
      formTaxList: finnalList,
    });
  },

  // 根据区域code获取登陆方式
  async $getLoginType(areaCode) {
    const data = await services.getLoginType({
      areaCode,
    });
    const types = [
      'usernameLogin',
      'caLogin',
      'taxControlLogin',
      'taxTrayLogin',
      'sMSVerificationLogin',
      'declarePasswordLogin',
    ];
    const declarationTypes = types
      .map((key, index) => (data[key] ? index : undefined))
      .filter((val) => val !== undefined);
    this.updateState({
      declarationTypes,
      // 验证码登录方式字段控制需要的字段
      smsverificationData: pick(data, [
        'sMSVerificationLoginIdentity',
        'sMSVerificationPassword',
        'sMSVerificationPhoneNum',
        'sMSVerificationUserName',
        'loginIdentityInfoList',
      ]),
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
          await this.updateTax(true);
          resolve(true);
        },
        onCancel() {
          resolve(true);
        },
      });
    });
  },

  // 初始化
  async initData() {
    await this.$getCompanySetting();
    await this.$getTaxInfo();
  },
};
