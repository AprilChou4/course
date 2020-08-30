/**
 * 该文件创建axios实例，以及设置一些默认配置
 */

import axios, { defaults } from "axios";

const instance = axios.create({
  baseURL: "/",
  headers: {
    // 'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
    // Accept: 'application/json;text/javascrip;charset=utf-8',
    timeout: 1000,
    "Cache-Control": "no-cache",
    Expires: 0,
    Pragma: "no-cache",
  },
  transformRequest: [
    (data) => {
      /* eslint-disable no-param-reassign */
      try {
        const res = JSON.parse(JSON.stringify(data), (k, v) => {
          // 针对form表单获取数据为null的问题 转换为undefined 不传递给后台
          if (v === null) {
            return undefined;
          }
          return v;
        });
        return res;
      } catch (error) {
        return data;
      }
    },
    ...defaults.transformRequest,
  ],
});

export default instance;
