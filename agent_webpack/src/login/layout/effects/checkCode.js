// 验证码相关接口
import services from '../services';

export default {
  /**
   * 发送代账激活公司短信验证码
   * @param {*} phoneNum 手机号
   * @param {*} code 短信验证码
   */
  async $dzActiveMobileCode(payload) {
    try {
      const data = await services.dzActiveMobileCode(payload, {
        returnAll: true,
      });
      return data;
    } catch (res) {
      return res;
    }
  },

  /**
   * 检验代账激活公司短信验证码
   * @param {*} phoneNum 手机号
   * @param {*} code 短信验证码
   */
  async $dzActiveMobileCodeCheck(payload) {
    const data = await services.dzActiveMobileCodeCheck(payload, {
      returnAll: true,
    });
    return data;
  },

  /**
   * 发送代账加入公司短信验证码
   * @param {*} phoneNum 手机号
   * @param {*} code 短信验证码
   */
  async $dzJoinMobileCode(payload) {
    try {
      const data = await services.dzJoinMobileCode(payload, {
        returnAll: true,
      });
      return data;
    } catch (res) {
      return res;
    }
  },

  /**
   * 检验代账加入公司短信验证码
   * @param {*} phoneNum 手机号
   * @param {*} code 短信验证码
   */
  async $dzJoinMobileCodeCheck(payload) {
    const { joinInfo } = this.getState();
    await services.dzJoinMobileCodeCheck(payload);
    this.updateState({
      joinStep: 2,
      joinInfo: {
        ...joinInfo,
        ...payload,
      },
    });
  },

  /**
   * 检验代账完善信息--加入公司短信验证码
   * @param {*} phoneNum 手机号
   * @param {*} code 短信验证码
   */
  async $dzCompleteJoinMobileCodeCheck(payload) {
    const { completeInfo } = this.getState();
    await services.dzJoinMobileCodeCheck(payload);
    this.updateState({
      completeStep: 4,
      completeInfo: {
        ...completeInfo,
        ...payload,
      },
    });
  },
  /**
   * 发送记账注册公司短信验证码
   * @param {*} phoneNum 手机号
   * @param {*} code 短信验证码
   */
  async $jzRegisterMobileCode(payload) {
    const { registerInfo } = this.getState();
    try {
      const data = await services.jzRegisterMobileCode(
        {
          phoneNum: payload.phoneNum,
          code: payload.code,
        },
        {
          returnAll: true,
        },
      );
      this.updateState({
        registerInfo: {
          ...registerInfo,
          ...payload,
        },
      });
      return data;
    } catch (res) {
      return res;
    }
  },

  /**
   * 检验记账注册公司短信验证码
   * @param {*} phoneNum 手机号
   * @param {*} code 短信验证码
   */
  async $jzRegisterMobileCodeCheck(payload) {
    await services.jzRegisterMobileCodeCheck(payload);
    this.updateState({
      registerStep: 3,
      registerInfo: payload,
    });
  },

  /**
   * 发送代账注册短信验证码
   * @param {*} phoneNum 手机号
   * @param {*} code 短信验证码
   */
  async $dzRegisterMobileCode(payload) {
    try {
      const data = await services.dzRegisterMobileCode(payload, {
        returnAll: true,
      });
      return data;
    } catch (res) {
      return res;
    }
  },

  /**
   * 检验代账注册短信验证码
   * @param {*} phoneNum 手机号
   * @param {*} code 短信验证码
   */
  async $dzRegisterMobileCodeCheck(payload) {
    const { registerInfo } = this.getState();
    await services.dzRegisterMobileCodeCheck(payload);
    this.updateState({
      registerStep: 4,
      registerInfo: {
        ...registerInfo,
        ...payload,
      },
    });
  },

  /**
   * 检验代账注册 ---加入公司短信验证码
   * @param {*} phoneNum 手机号
   * @param {*} code 短信验证码
   */
  async $dzRegisterJoinMobileCodeCheck(payload) {
    const { registerInfo } = this.getState();
    await services.dzJoinMobileCodeCheck(payload);
    this.updateState({
      registerStep: 4,
      registerInfo: {
        ...registerInfo,
        ...payload,
      },
    });
  },

  /**
   * 发送记账完善短信验证码
   * @param {*} phoneNum 手机号
   * @param {*} code 短信验证码
   */
  async $jzCompleteMobileCode(payload) {
    try {
      const data = await services.jzCompleteMobileCode(payload, {
        returnAll: true,
      });
      return data;
    } catch (res) {
      return res;
    }
  },
  /**
   * 检验记账完善短信验证码
   * @param {*} phoneNum 手机号
   * @param {*} code 短信验证码
   */
  async $jzCompleteMobileCodeCheck(payload) {
    const { completeInfo } = this.getState();
    await services.jzCompleteMobileCodeCheck(payload);
    this.updateState({
      completeStep: 3,
      completeInfo: {
        ...completeInfo,
        ...payload,
      },
    });
  },

  /**
   * 发送代账完善信息注册短信验证码
   * @param {*} phoneNum 手机号
   * @param {*} code 短信验证码
   */
  async $dzCompleteMobileCode(payload) {
    try {
      const data = await services.dzCompleteMobileCode(payload, {
        returnAll: true,
      });
      return data;
    } catch (res) {
      return res;
    }
  },
  /**
   * 检验代账完善信息注册短信验证码
   * @param {*} phoneNum 手机号
   * @param {*} code 短信验证码
   */
  async $dzCompleteMobileCodeCheck(payload) {
    const { completeInfo } = this.getState();
    await services.dzCompleteMobileCodeCheck(payload);
    this.updateState({
      completeStep: 4,
      completeInfo: {
        ...completeInfo,
        ...payload,
      },
    });
  },
};
