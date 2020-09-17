const createServices = (services = {}) => {
  const requests = {};

  Object.entries(services).forEach((item) => {
    const [name, urlAndType] = item;

    const [url, initType] = urlAndType.split(':');
    // 默认 type 为 get
    const type = initType || 'get';

    requests[name] = async (data = {}, options = {}) => {
      const { loading, returnAll, ...otherOptions } = options;
      // 请求全局 loading 触发
      if (loading) {
        store.dispatch({
          type: 'account/_updateLoading',
          payload: {
            loading,
          },
        });
      }

      let res = null;
      let errRes = null;

      // 调用 request 模块
      res = await request({ url, data, type, ...otherOptions })
        .catch((err) => {
          errRes = err;
        })
        .finally(() => {
          if (loading) {
            store.dispatch({
              type: 'account/_updateLoading',
              payload: {
                loading: false,
              },
            });
          }
        });

      // 请求出错（404 或 res.status !== 200 等预先配置的错误类型）
      if (errRes) {
        // return reject 状态时可以中止 async 函数后续代码的执行，
        // 从而不用在 async 函数中做额外的错误处理
        return Promise.reject(errRes || '请求失败');
      }

      // 默认返回 res.data
      return returnAll ? res : res.data;
    };
  });

  return requests;
};
