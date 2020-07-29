export default {
  validateStatus() {
    return {
      message: '当前企客户不存在代开的代理关系，请联系企业开通',
      result: 'success',
      status: 200,
      data: {
        agentStatus: 0,
      },
    };
  },
  saveCreditCode() {
    return {
      message: '客户没有税号',
      result: 'success',
      status: 200,
      data: null,
    };
  },
  sendMessageCode() {
    return {
      message: '获取验证码频繁，请次日再试！',
      result: 'success',
      status: 200,
      data: '已向企业联系人秦*（180****2134）成功发送验证码短信，请提醒企业联系人查收。',
    };
  },
  validateMessageCode() {
    return {
      message: '验证码错误!',
      result: 'success',
      status: 906,
      data: '已向企业联系人秦*（180****2134）成功发送验证码短信，请提醒企业联系人查收。',
    };
  },
};
