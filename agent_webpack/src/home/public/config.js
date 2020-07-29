/* eslint-disable import/prefer-default-export */
import { request } from 'nuijs';
import { message as Message } from 'antd';
import { nuomi } from 'nuomi';
import moment from 'moment';
import 'moment/locale/zh-cn';

moment.locale('zh-cn');

Message.config({
  duration: 2,
  maxCount: 1,
});

const successStatusFnc = (res, { successMsg }) => {
  successMsg && Message.success(successMsg);
};

const errStatusFnc = (res, { errMsg }) => {
  const { message = '请求失败' } = res;
  console.error(`请求失败：${JSON.stringify(res)}`);
  Message.error(errMsg || message);
};

export const requestConfig = {
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
  },
  intercept({ status, data, url }) {
    if (status) {
      // 登录拦截
      // eslint-disable-next-line
      if (status === 308) {
        window.parent &&
          window.parent.microServiceLoginFailed &&
          window.parent.microServiceLoginFailed();
        return false;
      }
    }
  },
};
request.config(requestConfig);

// nuomi全局配置
nuomi.config({
  effects: {
    updateState(payload) {
      this.dispatch({
        type: `_updateState`,
        payload,
      });
    },
    updateLoading(payload) {
      this.dispatch({
        type: `_updateLoading`,
        payload,
      });
    },
  },
});
