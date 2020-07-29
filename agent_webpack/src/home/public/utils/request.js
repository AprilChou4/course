// 最新版本 2019.11.29
import { request } from 'nuijs';
import { message } from 'antd';
/**
 * @param {String} - url fetch request url
 * @param {Object} - options fetch options
 */

const req = (method, url, data, loadingText) => {
  return new Promise((resolve, reject) => {
    request[method](
      url,
      data,
      (res) => {
        if (res && (!res.result || res.result === 'success' || res.status === 200)) {
          resolve(res);
        } else {
          reject(res);
        }
      },
      loadingText || null, // nuijs的request默认有loading，并且设置为null才不显示，这里改为默认不显示loading
    ).error((res) => {
      reject(res);
    });
  });
};

const createRequest = (type) => async (api, params, options = {}) => {
  const { returnAll = false, showErrorMsg = true, errorMsg, loading } = options;
  try {
    const data = await req(type, api, params, loading);
    return data;
  } catch (error) {
    showErrorMsg && message.error(errorMsg || error.message || '请求失败！');
    return returnAll ? error : null;
  }
};

export default {
  get: createRequest('get'),
  post: createRequest('post'),
  postJSON: createRequest('postJSON'),
};
