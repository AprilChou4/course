import { message } from 'antd';
import ShowConfirm from '@components/ShowConfirm';
import React from 'react';
import { Base64 } from 'js-base64';
import sso from '@login/public/sso';
import { util } from '@utils';
import services from '../services';
import register from './register';
import checkCode from './checkCode';

export default {
  ...register,
  ...checkCode,
  // 获取单点登录所需的完善信息
  // async $getCompleteUserInfo() {
  //   const data = await services.getCompleteUserInfo();
  //   this.updateState({
  //     companyList: data,
  //   });
  // },
  /**
   * 登录
   * @param {*} code  验证码
   * @param {*} password  密码
   * @param {*} username  用户名
   * @param {*} versionType  登录类型(0:记账,1:代账,2:默认)
   */
  async $userLogin(payload) {
    const { updateImgCode, ...rest } = payload;
    const data =
      (await services.userLogin(rest, {
        status: {
          300: (res) => {
            // 更新图片验证码
            updateImgCode();
            message.error(res.message);
          },
          // 待激活企业
          304: (res) => {
            const noActiveList = res.data || [];
            if (noActiveList.length === 1) {
              this.updateState({
                activeCompanyVisible: true,
                loginVisible: false,
                selectedCompanyInfo: noActiveList[0],
                loginInfo: {
                  ...payload,
                  phoneNum: payload.username,
                },
              });
            } else {
              this.updateState({
                chooseCompanyVisible: true,
                loginVisible: false,
                companyList: noActiveList,
                loginInfo: {
                  ...payload,
                  phoneNum: payload.username,
                },
              });
            }
          },
          // 待申请企业
          306: (res) => {
            const waitApplyList = res.data || [];
            this.updateState({
              companyList: waitApplyList,
              loginInfo: {
                ...payload,
                phoneNum: payload.username,
              },
              chooseCompanyVisible: true,
              isLoginStatus: false,
              loginVisible: false,
            });
          },
        },
      })) || {};
    const { newUser, resfunc, ssoDomain, ssoLoginToken, versionType } = data;
    sso(data, this.dispatch);

    // 新用户需要完善信息
    if (newUser) {
      const loginCompleteInfo = await services.getCompleteUserInfo();
      this.updateState({
        completeInfoVisible: true,
        loginVisible: false,
        // versionType,
        isLoginStatus: false, // 不是真正的登录状态
        loginInfo: loginCompleteInfo,
      });
    } else {
      // 记住密码
      if (payload.remember) {
        localStorage.setItem('rememberPassword', Base64.encode(JSON.stringify(payload)));
      } else {
        localStorage.setItem(
          'rememberPassword',
          Base64.encode(JSON.stringify({ remember: payload.remember })),
        );
      }
      // 选择企业
      this.updateState({
        // chooseCompanyVisible: true,
        loginVisible: false,
        versionType,
        isLoginStatus: true,
        loginInfo: payload,
      });
      // util.location(`${basePath}cloud/index.html`);
      // location.replace(`${basePath}cloud/index.html`);
    }
  },

  // 获取用户所有企业列表
  async $getCompanyList() {
    const data = await services.getCompanyList();
    this.updateState({
      companyList: data,
    });
  },

  /**
   * 切换企业
   * @param {*} companyId 公司id
   */
  async $changeCompany(payload) {
    const { companyId, versionType } = payload;
    const data = await services.changeCompany(
      { companyId },
      {
        loadingText: '正在登录中...',
      },
    );
    if (versionType === 0) {
      // localStorage.setItem('versionType', '0');
      // location.replace(`${basePath}accounts.html`);
      util.location(`${basePath}accounts.html`);
    } else {
      // localStorage.setItem('versionType', '1');
      // location.replace(`${basePath}cloud/index.html`);
      util.location(`${basePath}cloud/index.html`);
    }
    this.updateState({
      versionType,
    });
  },
  /**
   * 激活企业
   * @param {*string} realName 真实姓名
   * @param {*string} companyName 公司名称
   * @param {*string} companyId 公司id
   * @param {*string} code 验证码
   * @param {*string} phoneNum 手机号
   */
  async $activateCompany(payload) {
    const { setVisible, setMobileCode, ...rest } = payload;
    const data = await services.activateCompany(rest);
    this.updateState({
      activeCompanyVisible: false,
    });
    if (data.updatePwd) {
      // 打开验证码弹窗
      setVisible(true);
      setMobileCode(payload.code);
    } else {
      sso(data, this.dispatch);
    }
  },

  /**
   * 修改密码
   * @param {*string} password 密码（base64加密）
   * @param {*string} rePassword 重复密码
   * @param {*string} code 验证码
   * @param {*string} phoneNum 手机号
   */
  async $updatePassword(payload) {
    await services.updatePassword(payload);
  },

  /**
   * 重新申请
   * @param {*string} companyId 公司ID
   * @param {*string} phone 用户名或手机号
   */
  async $reJoinStatus(payload) {
    await services.reJoinStatus(payload, {
      status: {
        300: (res) => {
          // 操作次数限制，每次申请间隔至少大于1个小时，少于一小时弹出提示；
          message.warning(res.message);
        },
        400: (res) => {
          // 每天只能操作5次申请，超出5次弹出提示；
          ShowConfirm({
            width: 346,
            type: 'warning',
            title: '已经超出今天申请次数',
            content: '超出后将不能再提交申请，请明天再试',
          });
        },
      },
    });
    message.success('重新申请提交成功');
  },

  /**
   * 撤销加入公司申请
   * @param {*string} companyId 公司ID
   * @param {*string} phoneNum 用户名或手机号
   */
  async $cancelJoinStatus(payload) {
    await services.cancelJoinStatus(payload);
    this.$getCompanyList();
    message.success('您的加入企业申请已撤销');
  },

  /**
   * 删除企业
   * @param {*} companyId 公司id
   * @param {*} phoneNum  手机号码
   */
  async $delCompany(payload) {
    await services.delCompany(payload);
    this.$getCompanyList();
  },

  /**
   * 根据手机号获取获取诺诺用户信息
   * @param {*} phoneNum 手机号
   */
  async $getUserInfoByPhone(payload) {
    const data = await services.getUserInfoByPhone({
      ...payload,
    });
    return data;
  },

  /**
   * 根据公司名称获取公司信息
   * @param {*} companyName 公司名称
   */
  // async $getCompanyByName(payload) {
  //   await services.getCompanyByName(payload);
  // },

  // /**
  //  * 检验手机号当前状态
  //  * @param {*} companyId  公司id，检验加入公司时传入
  //  * @param {*} mobile 手机号
  //  */
  // async $checkPhone(payload) {
  //   const { callback, ...params } = payload;
  //   const data = await services.checkPhone(params);
  //   let msg = '';
  //   const { registerNuonuo } = data;
  //   // if (registerNuonuo) {
  //   //   return callback('当前手机号已注册诺诺网账号，点击下一步立即加入公司');
  //   // }
  //   // return callback();
  //   if (registerNuonuo) {
  //     msg = '当前手机号已注册诺诺网账号，点击下一步立即加入公司';
  //   }
  //   return msg;
  // },
};
