import React from 'react';
import effects from './effects';
import Layout from './components/Layout';

export default {
  id: 'agentAccount_login_layout',
  state: {
    // 登录状态
    isLoginStatus: false,
    // 登录类型(0:记账,1:代账,2:默认)
    versionType: 2,
    // 创建公司=0;加入已有公司=1 默认=2
    selectedCompanyType: 2,
    // =======================登录相关================
    // 登录弹窗是否显示
    loginVisible: false,
    // 登录信息参数，用于激活等
    loginInfo: {},
    // =======================注册相关================
    // 注册弹窗是否显示
    registerVisible: false,
    // 注册公司步骤
    registerStep: 1,
    // 注册公司信息-需提交的
    registerInfo: {},
    // 隐私弹窗
    privacyVisible: false,
    // 注册协议弹窗
    protocolVisible: false,
    /**
     * 检验手机号当前状态后返回的信息
     *
     * isMobile=是否是正确的手机格式; activateCompany=是否待激活状态；applyForCompany=是否待审批状态；dzManage
     * isDzManage=是否是云代账超级管理员; registerCloud=是否注册云记账/代账系统;
     * registerDz=是否注册云代账; registerJz=是否注册云记账;
     * registerNuonuo=是否注册诺诺网;serviceStaff=是否正式员工; stop=是否已停用;
     */
    phoneNumInfo: {
      isMobile: false,
    },
    //= ========= 选择企业=====================
    // 选择企业弹窗是否显示
    chooseCompanyVisible: false,
    // 企业列表
    companyList: [],
    // 选中的企业信息
    selectedCompanyInfo: {},
    // 激活企业弹窗
    activeCompanyVisible: false,
    // 修改密码弹窗
    updatePasswordVisible: false,
    // =====================加入公司=======================
    // 加入公司来源 注册=0; 登录=1
    joinSource: 0,
    // 加入公司弹窗是否显示
    joinCompanyVisible: false,
    // 加入公司成功提示弹窗
    joinSuccessVisible: false,
    // 加入公司步骤
    joinStep: 1,
    // 加入公司信息-需提交的
    joinInfo: {},

    // 完善信息弹窗
    completeInfoVisible: false,
    // 完善步骤
    completeStep: 1,
    // 完善信息-需提交的
    completeInfo: {},
    // 申请成功提示弹窗
    applySuccessVisible: false,
    // 成功注册、完善后返回信息===用于单点登录
    successReturnInfo: {},
  },
  effects,
  render() {
    return <Layout type={this.type}>{this.children}</Layout>;
  },
};
