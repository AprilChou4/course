import { createServices } from '@utils';
import mock from './mock';

export default createServices({
  userLogin: 'http://192.168.206.92:3000/mock/516/instead/v2/user/allow/login.do::postJSON', // 用户登录
  loginImageCodeCheck:
    'http://192.168.206.92:3000/mock/516/instead/v2/user/allow/verification/code/loginImageCodeCheck.do', // 检验登录图片验证码
  // ===================企业相关===============================
  getCompanyList: 'http://192.168.206.92:3000/mock/516/instead/v2/user/company/list.do::postJSON', // 获取用户所有企业列表
  changeCompany: 'http://192.168.206.92:3000/mock/516/instead/v2/user/company/change.do::postJSON', // 切换企业
  cancelJoinStatus:
    'http://192.168.206.92:3000/mock/516/instead/v2/user/dz/allow/cancelJoinStatus.do::postJSON', // 撤销加入公司申请
  reJoinStatus:
    'http://192.168.206.92:3000/mock/516/instead/v2/user/dz/allow/reJoinStatus.do::postJSON', // 重新申请
  activateCompany:
    'http://192.168.206.92:3000/mock/516/instead/v2/user/dz/allow/activateCompany.do::postJSON', // 激活公司
  updatePassword: 'http://192.168.206.92:3000/mock/516/instead/v2/user/updatePassword.do::postJSON', // 修改密码
  delCompany:
    'http://192.168.206.92:3000/mock/516/instead/v2/user/dz/allow/cancelActiveStatus.do::postJSON', // 删除企业

  dzActiveImageCodeCheck:
    'http://192.168.206.92:3000/mock/516/instead/v2/user/allow/verification/code/dzActiveImageCodeCheck.do::postJSON', // 检验代账激活公司获取图片验证码
  dzActiveMobileCodeCheck:
    'http://192.168.206.92:3000/mock/516/instead/v2/user/allow/verification/code/dzActiveMobileCodeCheck.do::postJSON', // 发送代账激活公司短信验证码
  dzJoinImageCodeCheck:
    'http://192.168.206.92:3000/mock/516/instead/v2/user/allow/verification/code/dzJoinImageCodeCheck.do::postJSON', // 检验代账加入公司图片验证码

  dzJoinMobileCodeCheck:
    'http://192.168.206.92:3000/mock/516/instead/v2/user/allow/verification/code/dzJoinMobileCodeCheck.do::postJSON', // 发送代账加入公司短信验证码
  dzRegisterImageCodeCheck:
    'http://192.168.206.92:3000/mock/516/instead/v2/user/allow/verification/code/dzRegisterImageCodeCheck.do::postJSON', // 检验代账注册图片验证码
  dzRegisterMobileCode:
    'http://192.168.206.92:3000/mock/516/instead/v2/user/allow/verification/code/dzRegisterMobileCode.do::postJSON', // 发送代账注册短信验证码
  dzCompleteImageCodeCheck:
    'http://192.168.206.92:3000/mock/516/instead/v2/user/allow/verification/code/dzCompleteImageCodeCheck.do::postJSON', // 检验代账完善信息注册图片验证码
  dzCompleteMobileCode:
    'http://192.168.206.92:3000/mock/516/instead/v2/user/allow/verification/code/dzCompleteMobileCode.do::postJSON', // 发送代账完善信息注册短信验证码
  jzRegisterImageCodeCheck:
    'http://192.168.206.92:3000/mock/516/instead/v2/user/allow/verification/code/jzRegisterImageCodeCheck.do::postJSON', // 检验记账注册公司图片验证码

  jzRegisterMobileCodeCheck:
    'http://192.168.206.92:3000/mock/516/instead/v2/user/allow/verification/code/jzRegisterMobileCodeCheck.do::postJSON', // 发送记账注册公司短信验证码

  checkPhone: 'http://192.168.206.92:3000/mock/516/instead/v2/user/allow/checkPhone.do::postJSON', // 检验手机号当前状态
  joinCompany:
    'http://192.168.206.92:3000/mock/516/instead/v2/user/dz/allow/joinCompany.do::postJSON', // 加入公司

  getCompanyByName:
    'http://192.168.206.92:3000/mock/516/instead/v2/user/dz/allow/getCompanyByName.do', // 根据公司名称获取公司信息
  jzRegister: 'http://192.168.206.92:3000/mock/516/instead/v2/user/jz/allow/register.do::postJSON', // 记账注册
  jzCompleteInfo:
    'http://192.168.206.92:3000/mock/516/instead/v2/user/jz/allow/completeInfo.do::postJSON', // 记账完善信息
  dzRegister: 'http://192.168.206.92:3000/mock/516/instead/v2/user/dz/allow/register.do::postJSON', // 代账注册
  dzCompleteInfo:
    'http://192.168.206.92:3000/mock/516/instead/v2/user/dz/allow/completeRegister.do::postJSON', // 代账完善信息
  jzCompleteImageCodeCheck:
    'http://192.168.206.92:3000/mock/516/instead/v2/user/allow/verification/code/jzCompleteImageCodeCheck.do:postJSON', // 检验记账完善图片验证码

  jzCompleteMobileCodeCheck:
    'http://192.168.206.92:3000/mock/516/instead/v2/user/allow/verification/code/jzCompleteMobileCodeCheck.do::postJSON', // 发送记账完善短信验证码

  getUserInfoByPhone: 'http://192.168.206.92:3000/mock/516/instead/v2/user/allow/getUserInfo.do', // 根据手机号获取获取诺诺用户信息
  // ...mock,
});
