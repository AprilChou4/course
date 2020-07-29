// 注册相关接口
import { message } from 'antd';
import ShowConfirm from '@components/ShowConfirm';
import services from '../services';

export default {
  /**
   * 记账注册
   * @param {*} areaCode 企业区域编码
   * @param {*} companyName 公司名称
   * @param {*} password 密码
   * @param {*} rePassword 重复密码
   * @param {*} code 验证码
   * @param {*} phoneNum 手机号
   * @param {*} realName 姓名
   * @param {*} source 用户来源，代开invoice，开放平台openPlatform
   * @param {*} versionType 版本类型0记账1代账
   */
  async $jzRegister(payload) {
    const data = await services.jzRegister(payload);
    this.updateState({
      registerInfo: payload,
      successReturnInfo: data,
      registerStep: 4,
    });
  },

  /**
   * 记账完善信息
   * @param {*} areaCode 企业区域编码
   * @param {*} companyName 公司名称
   * @param {*} password 密码
   * @param {*} rePassword 重复密码
   * @param {*} code 验证码
   * @param {*} phoneNum 手机号
   * @param {*} realName 姓名
   * @param {*} source 用户来源，代开invoice，开放平台openPlatform
   * @param {*} versionType 版本类型0记账1代账
   */
  async $jzCompleteInfo(payload) {
    const data = await services.jzCompleteInfo(payload);
    this.updateState({
      completeInfo: payload,
      successReturnInfo: data,
      completeStep: 4,
    });
  },
  /**
   * 代账注册
   * @param {*} areaCode 企业区域编码
   * @param {*} companyName 公司名称
   * @param {*} password 密码
   * @param {*} rePassword 重复密码
   * @param {*} code 验证码
   * @param {*} phoneNum 手机号
   * @param {*} realName 姓名
   * @param {*} source 用户来源，代开invoice，开放平台openPlatform
   * @param {*} versionType 版本类型0记账1代账
   */
  async $dzRegister(payload) {
    const data = await services.dzRegister(payload);
    this.updateState({
      registerInfo: payload,
      successReturnInfo: data,
      registerStep: 5,
    });
  },

  /**
   * 代账完善信息
   * @param {*} areaCode 企业区域编码
   * @param {*} companyName 公司名称
   * @param {*} password 密码
   * @param {*} rePassword 重复密码
   * @param {*} code 验证码
   * @param {*} phoneNum 手机号
   * @param {*} realName 姓名
   * @param {*} source 用户来源，代开invoice，开放平台openPlatform
   * @param {*} versionType 版本类型0记账1代账
   */
  async $dzCompleteInfo(payload) {
    const data = await services.dzCompleteInfo(payload);
    this.updateState({
      completeInfo: payload,
      successReturnInfo: data,
      completeStep: 5,
    });
  },

  // 完善信息加入公司
  async $dzCompleteJoinInfo(payload) {
    const data = await services.joinCompany(payload);
    this.updateState({
      completeInfo: payload,
      successReturnInfo: data,
      applySuccessVisible: true,
      completeInfoVisible: false,
    });
  },

  /**
   *  加入公司-----0.立即注册> 代账 >加入公司; 1.登录>加入公司
   * @param {*} phoneNum 手机号
   * @param {*} companyId 公司id
   * @param {*} companyName 公司名称
   * @param {*} code 短信验证码
   * @param {*} realName 真实姓名
   */
  async $joinCompany(payload) {
    const { joinSource } = this.getState();
    const data = await services.joinCompany(payload, {
      status: {
        300: (res) => {
          message.warning(res.message);
        },
        304: (res) => {
          const noActiveList = res.data || [];
          ShowConfirm({
            title: `【${payload.companyName}】已添加您为员工，请前往直接激活！`,
            width: 270,
            okText: '激活',
            onOk: () => {
              this.updateState({
                activeCompanyVisible: true,
                loginVisible: false,
                selectedCompanyInfo: noActiveList[0],
              });
            },
          });
          this.updateState({
            registerVisible: false,
            joinCompanyVisible: false,
            loginInfo: {
              ...payload,
              username: payload.phoneNum,
            },
          });
        },
      },
    });
    if (joinSource === 0) {
      // 注册加入公司
      this.updateState({
        registerInfo: payload,
        registerStep: 5,
      });
    } else {
      // 登录加入公司
      this.updateState({
        joinInfo: payload,
        joinCompanyVisible: false,
        joinSuccessVisible: true,
        registerVisible: false,
      });
    }
  },
};
