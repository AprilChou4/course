// services.js
export default util.createServices({
  getUsers: 'test/user/list:get',
  addUsers: 'test/user/add:post',
});

// effects.js
const getUsers = async (params) => {
  const users = await services.getUsers(params);
  // service 请求出错时一下代码不会执行，默认无需错误捕获
  this.setState({ users: users || [] });
};

// 默认不需要错误捕获，但有时可能也需要获取错误信息自定义操作
const getUsers = async (params) => {
  const res = await services.getUsers(params).catch((err) => {
    console.log(err);
  });

  // 或
  try {
    const res = await services.getUsers(params);
  } catch (err) {
    console.log(err);
  }

  // 此时捕获到错误，后续代码会执行，需要额外判断
  if (!res) return;

  this.setState({ users: users || [] });
};

// 可选 service 配置项
const res = await services.getUsers(params, {
  // 默认 false，返回 res.data，为 true 时返回 res
  returnAll: true,
  // 请求显示全局 loading 提示
  loading: '请稍后...',
  // 自定义 status 对应业务逻辑
  status: {
    '^300': (res) => {
      message.error(res.message);
    },
    30000000082: () => {
      // do something...
    },
  },
});
