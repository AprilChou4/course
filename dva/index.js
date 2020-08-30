// 1. Initialize
const app = dva({
  // 处理所有请求失败或者异常
  onError(error, dispatch) {
    // prevent promise reject
    error.preventDefault();
    // 开发模式时输出错误信息
    /* eslint-disable no-console */
    if (!prodEnv) {
      console.error(error);
    }
    if (!error.stack) {
      const { status, data } = error;
      if (!status) {
        openConfirm({ content: "网络开小差了, 请检查网络环境" });
      } else {
        const { code, message: mess, msg } = data;
        // TODO 需要判断是否session失效
        if (inRange(code, ...REQUEST_SUCCESS_REGION)) {
          if (mess || msg) {
            message.warning(mess || msg);
          } else {
            openConfirm({ content: "系统异常" });
          }
        } else if (code === 401) {
          // session失效
          openConfirm({
            title: "登录超时",
            content: "当前用户登录已失效, 点击确定以重新登录",
            onOk: () => {
              modalCloseFn();
              dispatch({ type: "app/loginOut" });
            },
          });
        } else if (code === 403) {
          // url无权限访问
          openConfirm({
            content: "url无权限访问",
          });
        } else if (code === 500) {
          // 返回失败
          openConfirm({
            content: mess || msg,
          });
        } else if (mess || msg) {
          openConfirm({ content: mess || msg });
        } else {
          openConfirm({ content: "系统异常" });
        }
      }
    } else {
      openConfirm({ content: "系统异常" });
    }
  },
});
