import { createServices } from '@utils';

export default createServices({
  getCompleteUserInfo: 'instead/v2/user/allow/getCompleteUserInfo.do',
  userLogin: 'instead/v2/user/allow/login.do::postJSON', // 用户登录
  loginImageCodeCheck: 'instead/v2/user/allow/verification/code/loginImageCodeCheck.do', // 检验登录图片验证码
  // ===================企业相关===============================
  getCompanyList: 'instead/v2/user/company/list.do::postJSON', // 获取用户所有企业列表
  changeCompany: 'instead/v2/user/company/change.do::post', // 切换企业
  cancelJoinStatus: 'instead/v2/user/dz/allow/cancelJoinStatus.do::postJSON', // 撤销加入公司申请
  reJoinStatus: 'instead/v2/user/dz/allow/reJoinStatus.do::postJSON', // 重新申请
  activateCompany: 'instead/v2/user/dz/allow/activateCompany.do::postJSON', // 激活公司
  updatePassword: 'instead/v2/user/updatePassword.do::postJSON', // 修改密码
  delCompany: 'instead/v2/user/dz/allow/cancelActiveStatus.do::postJSON', // 删除企业

  dzActiveImageCodeCheck: 'instead/v2/user/allow/verification/code/dzActiveImageCodeCheck.do::post', // 检验代账激活公司获取图片验证码

  dzJoinImageCodeCheck: 'instead/v2/user/allow/verification/code/dzJoinImageCodeCheck.do::post', // 检验代账加入公司图片验证码

  dzRegisterImageCodeCheck:
    'instead/v2/user/allow/verification/code/dzRegisterImageCodeCheck.do::post', // 检验代账注册图片验证码

  dzCompleteImageCodeCheck:
    'instead/v2/user/allow/verification/code/dzCompleteImageCodeCheck.do::post', // 检验代账完善信息注册图片验证码

  jzRegisterImageCodeCheck:
    'instead/v2/user/allow/verification/code/jzRegisterImageCodeCheck.do::post', // 检验记账注册公司图片验证码
  checkPhone: 'instead/v2/user/allow/checkPhone.do::post', // 检验手机号当前状态
  joinCompany: 'instead/v2/user/dz/allow/joinCompany.do::postJSON', // 加入公司

  getCompanyByName: 'instead/v2/user/dz/allow/getCompanyByName.do', // 根据公司名称获取公司信息
  jzRegister: 'instead/v2/user/jz/allow/register.do::postJSON', // 记账注册
  jzCompleteInfo: 'instead/v2/user/jz/allow/completeInfo.do::postJSON', // 记账完善信息
  dzRegister: 'instead/v2/user/dz/allow/register.do::postJSON', // 代账注册
  dzCompleteInfo: 'instead/v2/user/dz/allow/completeRegister.do::postJSON', // 代账完善信息
  jzCompleteImageCodeCheck:
    'instead/v2/user/allow/verification/code/jzCompleteImageCodeCheck.do::post', // 检验记账完善图片验证码

  getUserInfoByPhone: 'instead/v2/user/allow/getUserInfo.do', // 根据手机号获取获取诺诺用户信息
  getUser: 'instead/v2/user/allow/getUser.do', // 根据用户名/手机号精确匹配用户中心的用户
  dzActiveMobileCode: 'instead/v2/user/allow/verification/code/dzActiveMobileCode.do::post', // 发送代账激活公司短信验证码
  dzActiveMobileCodeCheck:
    'instead/v2/user/allow/verification/code/dzActiveMobileCodeCheck.do::post', // 检验代账激活公司短信验证码

  dzJoinMobileCode: 'instead/v2/user/allow/verification/code/dzJoinMobileCode.do::post', // 发送代账加入公司短信验证码
  dzJoinMobileCodeCheck: 'instead/v2/user/allow/verification/code/dzJoinMobileCodeCheck.do::post', // 检验代账加入公司短信验证码

  jzRegisterMobileCode: 'instead/v2/user/allow/verification/code/jzRegisterMobileCode.do::post', // 发送记账注册公司短信验证码
  jzRegisterMobileCodeCheck:
    'instead/v2/user/allow/verification/code/jzRegisterMobileCodeCheck.do::post', // 检验记账注册公司短信验证码

  dzRegisterMobileCode: 'instead/v2/user/allow/verification/code/dzRegisterMobileCode.do::post', // 发送代账注册短信验证码
  dzRegisterMobileCodeCheck:
    'instead/v2/user/allow/verification/code/dzRegisterMobileCodeCheck.do::post', // 检验代账注册短信验证码

  jzCompleteMobileCode: 'instead/v2/user/allow/verification/code/jzCompleteMobileCode.do::post', // 发送记账完善短信验证码
  jzCompleteMobileCodeCheck:
    'instead/v2/user/allow/verification/code/jzCompleteMobileCodeCheck.do::post', // 检验记账完善短信验证码

  dzCompleteMobileCode: 'instead/v2/user/allow/verification/code/dzCompleteMobileCode.do::post', // 发送代账完善信息注册短信验证码
  dzCompleteMobileCodeCheck:
    'instead/v2/user/allow/verification/code/dzCompleteMobileCodeCheck.do::post', // 检验代账完善信息注册短信验证码
});
