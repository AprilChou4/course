import axios from 'axios';
import Qs from 'qs'; // qs 在安装 axios 后会自动安装
import { message } from 'antd';
// 接口返回状态等配置
const requestConfig = {
  // 判断业务是否成功字段
  name: 'status',
  // 业务成功字段值
  value: 200,
  // url后缀
  ext: '.do',
  // url前缀
  preurl: (url) => {
    if (/^(https?:)?\/?\//.test(url)) {
      return '';
    }
    return '/';
  },
  // 统一错误提示
  status: {
    200: successStatusFnc,
    // 常用错误提示写一起了,如果某个需要特殊处理的,就提到外面单独写,否则自定义status覆盖不了
    '^(?!.*(200|300|304|306|400|^9)).*$': errStatusFnc, // eslint-disable-line
    300: errStatusFnc,
    304: errStatusFnc,
    306: errStatusFnc,
    400: errStatusFnc,
    900: errStatusFnc,
  },
  intercept(payload = {}) {
    const { status } = payload;
    if (status) {
      // 登录拦截
      // eslint-disable-next-line
      if (status === 308) {
        console.log('308', payload);
        window.parent &&
          window.parent.microServiceLoginFailed &&
          window.parent.microServiceLoginFailed();
        return false;
      }
    }
    // eslint
    return true;
  },
};

const { ext, preurl, query, intercept, status: statusConfig = {} } = requestConfig;
// 请求基础配置
const initialConfig = {
  type: 'get',
  data: {},
  url: '',
};

const encodeURIFunction = (data) => Qs.stringify(data);
// 根据请求方法设置 method、content-type、数据处理函数
const resolveReqType = (type) => {
  // 处理 postJSON 方法
  let method = '';
  let contentType = 'application/x-www-form-urlencoded; charset=UTF-8';
  let formatData = encodeURIFunction;

  if (type.toLowerCase() === 'postjson') {
    method = 'post';
    contentType = 'application/json';
    formatData = (data) => JSON.stringify(data);
  }

  // 处理 文件上传 formdata
  if (type === 'fd') {
    method = 'post';
    contentType = 'multipart/form-data;charset=UTF-8';
    formatData = (data) => data;
  }
  return {
    method,
    contentType,
    formatData,
  };
};

// URL 添加前缀或 .do
const formatUrl = (url) => {
  const URL = (preurl ? preurl(url) : '') + url;
  return URL.indexOf('.do') === -1 ? URL + ext : URL;
};



/**
 * @param {Object} config
 * @param {String} config.url - request url
 * @param {String} config.type - request method(post, get, postJSON, sync)
 * @param {String} config.headers - axios headers
 * @param {Boolean} config.returnAll - return res (default: res.data)
 * @param {Function} config.status - status 对应执行的函数，一般用于全局错误提示等，public/config.js 中配置
 * axios config docs: http://www.axios-js.com/docs/#Request-Config
 */
const req = (config = initialConfig) => {
  const {
    url,
    type,
    headers,
    status: customStatusConfig = {},
    errMsg,
    successMsg,
    returnAll,
    ...otherConfig
  } = config;
  const { method, contentType, formatData } = resolveReqType(type);

  const URL = formatUrl(url);
  const querys = { _: new Date().getTime() };
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
    console.error('request error:', err);
  }
  // 处理 404 等请求本身错误
  if (!res) {
    message.error('请求失败');
    return Promise.reject(new Error('请求失败'));
  }
    
    // 后端返回数据
  const resData = res && res.data;
  const { status = 200 } = resData;

  // 登录状态验证 intercept
  const testRes = intercept && intercept({ ...resData, url: URL });
  if (testRes === false) {
    return Promise.reject(new Error('请求失败'));
  }

  // 自定义 statusFn 执行
  const STATUS_CONFIG = { ...statusConfig, ...customStatusConfig };
  const statusConfigKeys = Object.keys(STATUS_CONFIG);
  let statusFn = null;

  statusConfigKeys.forEach((key) => {
    if (new RegExp(key).test(`${status}`)) {
      statusFn = STATUS_CONFIG[key];
    }
  });

  // 执行 status 对应的自定义或配置的全局函数，如 错误提示
  if (statusFn) {
    statusFn(resData, config);
  }

  if (Number(status) !== 200) {
    return Promise.reject(resData);
  }

  return resData;
};
export default req;
