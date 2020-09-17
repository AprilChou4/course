// 省略 contentTypeConfig、method 具体配置

// axios
const axiosConfig = {
  ...otherConfig,
  url: URL,
  method: method || type, // 适配其他 method
  headers: {
    'Content-Type': contentType,
    'Cache-Control': 'no-cache',
    ...headers,
  },
  params: type === 'get' ? { ...querys, ...config.data } : querys, // 请求参数 url 参数
  withCredentials: true,
  transformRequest: [formatData],
};

let res = null;
try {
  res = await axios.request(axiosConfig);
} catch (err) {
  console.log('request error:', err);
}
// 处理 404 等请求本身错误
if (!res) {
  message.error('请求失败');
  return Promise.reject('请求失败');
}

// 后端返回数据
const resData = res.data;
const { status } = resData;

// 登录状态验证 intercept
const testRes = intercept({ ...resData, url: URL });

if (testRes === false) {
  return Promise.reject('请求失败');
}

// 自定义 status: customStatusConfig 执行,即 service 调用时传入的 status 配置
// statusConfig 为默认 status 配置，一般配置 200 为成功，其他为失败
const STATUS_CONFIG = customStatusConfig || statusConfig;
const statusConfigKeys = Object.keys(STATUS_CONFIG);
let statusFn = null;

statusConfigKeys.forEach((key) => {
  if (new RegExp(key).test(`${status}`)) {
    statusFn = STATUS_CONFIG[key];
  }
});

// 执行 status 对应的自定义函数或配置的全局函数，如 错误提示
if (statusFn) {
  statusFn(resData);
}

if (Number(status) !== 200) {
  return Promise.reject(resData);
}

return resData;
