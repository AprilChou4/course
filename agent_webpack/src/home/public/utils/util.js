/* eslint-disable no-loop-func */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
/* eslint-disable no-param-reassign */
/* eslint-disable prefer-destructuring */
/* eslint-disable func-names */
/**
 * @func 工具函数集合
 */

import { util, template, request, layer } from 'nuijs';
import { store } from 'nuomi';
import moment from 'moment';
import clientAPI from './clientAPI';
import req from './req';

util.getParam = function getParam(name, urls) {
  const url = decodeURI(urls || location.href);
  let value = {};
  let startIndex = url.indexOf('?');

  if (startIndex++ > 0) {
    const param = url.substr(startIndex).split('&');
    var temp;
    Nui.each(param, function(val) {
      temp = val.split('=');
      value[temp[0]] = temp[1];
    });
  }

  if (typeof name === 'string' && name) {
    value = (temp = value[name]) !== undefined ? temp : '';
  }

  return value;
};

const accountToken = util.getParam('id', `/${window.location.search}`);

/**
 * @func 模拟location.href跳转
 * @return <Undefined>
 * @param url <String> 跳转的url
 * @param target <String> 跳转类型，默认为_self
 */
util.location = function(url, target) {
  if (url) {
    jQuery(`<a href="${url}"${target ? `target="${target || '_self'}"` : ''}><span></span></a>`)
      .appendTo('body')
      .children()
      .click()
      .end()
      .remove();
  }
};

util.store = function() {
  const args = arguments;
  const name = args[0];
  const data = JSON.parse(window.localStorage.getItem(name) || '{}');
  if (args.length > 1) {
    data[accountToken] = args[1];
    window.localStorage.setItem(name, JSON.stringify(data));
  } else {
    return data[accountToken];
  }
};

util.storeForUser = function() {
  const {
    user: { username },
  } = store.getState().account;
  const args = arguments;
  const name = args[0];
  const data = JSON.parse(window.localStorage.getItem(name) || '{}');
  if (args.length > 1) {
    data[username] = args[1];
    window.localStorage.setItem(name, JSON.stringify(data));
  } else {
    return data[username];
  }
};

util.logout = function() {
  request.post(
    'jz/user/exit',
    () => {
      if (typeof ExternService === 'object') {
        clientAPI.resScreen();
        window.location.replace('/client.html');
      } else {
        window.location.replace(basePath);
      }
    },
    '正在退出...',
  );
};

util.print = function(...args) {
  if (util.isInstallPDF()) {
    layer({
      height: 160,
      content: `<div class="f-tac e-pt20">
                    <i class="iconfont f-corange f-fs20 f-vam">&#xe6b2;</i>
                    <span class="f-dib e-mt-1 e-ml5 f-vam">打印需要借助PDF阅读器，请先下载！</span>
                </div>`,
      button: [
        {
          id: 'cancel',
        },
        {
          id: 'download',
          name: 'normal',
          text: '下载',
          callback() {
            util.location('https://get.adobe.com/reader/?loc=cn&promoid=KSWLH', '_blank');
          },
        },
      ],
    });
    return false;
  }
  util.submit(...args);
};

let downloadFrame;
util.submit = function(url, data = {}, target = '_blank', fig) {
  const oldData = [url, data, target];
  if (url) {
    const arr = url.split(':');
    const method = arr[1] || 'post';
    url = arr[0];
    url = request.config('preurl')(url) + url;
    data = { ...request.config('query'), ...data };
    if (!url.match(/\.\w+|\/$/)) {
      url += request.config('ext');
    }
    if (!url.match(/^(https?:\/)?\//)) {
      url = `/${url}`;
    }
    if (data.accountToken && !/\?accountToken/.test(url)) {
      url += `?accountToken=${data.accountToken}`;
    }
    if (typeof ExternService === 'object') {
      if (url.indexOf('/jz/accounting/accountbook/voucherPrint/print') !== -1 && !fig) {
        clientAPI.openAdobe(url, JSON.stringify(data), (res) => {
          if (!res) {
            util.submit(...oldData, (fig = true));
          }
        });
        return false;
      }

      if (!/(print|pdf)\w*\.do/i.test(url)) {
        target = 'download-file-iframe';
        if (!downloadFrame) {
          downloadFrame = document.createElement('iframe');
          downloadFrame.name = target;
          downloadFrame.style.display = 'none';
          document.body.appendChild(downloadFrame);
        }
      }
    }
    const from = template.render(
      `
        <form method="${method}" target="${target}" action="${url}">
            <%each data%>
            <%if $value !== undefined%>
            <input type="hidden" name="<%$index%>" value='<%$value%>'>
            <%/if%>
            <%/each%>
        </form>
        `,
      {
        data,
      },
    );
    const $form = $(from).appendTo('body');
    $form.submit();
    $form.remove();
  }
};

util.getUrl = function(url) {
  const preurl = request.config('preurl')(url);
  return preurl + url;
};

util.mend = function(val = '', num = 4) {
  val = `${val}`.toString();
  let _len = val.length;
  if (_len) {
    while (_len < num) {
      val = `0${val}`;
      _len++;
    }
  }
  return val;
};

// 获取字节长度
util.getByteLen = function(val) {
  let len = 0;
  val = val.split('');
  for (let i = 0; i < val.length; i++) {
    if (val[i].match(/[^x00-xff]/gi) != null)
      // 全角
      len += 2;
    else len += 1;
  }
  return len;
};

util.isUnNull = function(arr, logic) {
  function isnull(val) {
    return !!(typeof val === 'undefined' || val === '' || val === null);
  }
  if (typeof logic === 'undefined') {
    let flag = true;
    flag = !isnull(arr);
    return flag;
  }
  if (logic === 'and') {
    let flag = true;
    Nui.each(arr, function(val) {
      if (isnull(val)) {
        flag = false;
        return false;
      }
    });
    return flag;
  }
  if (logic === 'or') {
    let flag = false;
    Nui.each(arr, function(val) {
      if (!isnull(val)) {
        flag = true;
        return false;
      }
    });
    return flag;
  }
};

util.createRequest = (services = {}) => {
  const requests = {};
  for (const i in services) {
    const service = services[i];
    if (typeof service === 'function') {
      requests[i] = (data = {}, options = {}) =>
        new Promise((resolve, reject) => {
          setTimeout(() => {
            data = service(data);
            if (data.status === 200) {
              resolve(data.data);
            } else {
              reject(data);
              if (options.status && options.status[data.status]) {
                options.status[data.status]();
              }
            }
          }, options.delay || 500);
        });
    } else {
      const temp = service.split('::');
      const url = temp[0];
      const type = temp[1] || 'get';
      requests[i] = async (data = {}, options) => {
        const { loading, returnAll, ...otherOptions } = options || {};
        if (loading) {
          store.dispatch({
            type: 'agentAccount/_updateLoading',
            payload: {
              loading,
            },
          });
        }

        let res = null;
        let errRes = null;
        res = await req({ url, data, type, ...otherOptions })
          .catch((err) => {
            errRes = err;
          })
          .finally(() => {
            if (loading) {
              store.dispatch({
                type: 'agentAccount/_updateLoading',
                payload: {
                  loading: false,
                },
              });
            }
          });

        if (errRes) {
          return Promise.reject(errRes || '请求失败');
        }
        return returnAll ? res : res.data;
      };
    }
  }
  return requests;
};

// 精确四舍五入
util.preciseFixed = (num, prec = 2) => {
  let res = +num || 0;
  const abs = Math.abs(res);
  res = +`${Math.round(`${abs}e+${prec}`)}e-${prec}` * (num >= 0 || -1);

  return res == 0 ? '' : res.toFixed(prec);
};

// 金额数字添加千分符
util.thousandFix = (v) => {
  const r = `${v}`;
  if (r.indexOf('.') !== -1) {
    v;
    return r.replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
  }
  return r.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// 移除千分符、
util.thousandRemove = (v) => `${v}`.replace(/(,*)/g, '');

/**
 * 数字格式化
 * @param {(number|string)} v - 需要处理的值
 * @param {Object} option object - 参数选项
 * @param {Object} option.precision - 小数精度位数
 * @param {Object} option.maxDigit - 可输入的最大位数
 * @param {Object} option.enableMinus - 是否允许负数
 * @returns {string} value
 */
util.numberFormat = (v = '', option = { precision: 2, maxDigit: 9, enableMinus: false }) => {
  const { precision, maxDigit, enableMinus } = option;

  const reg = enableMinus ? /(?!^-)[^.|\d]/g : /[^.|\d]/g;
  // 全角转换为半角，去掉除多余的 “-”
  let r = util.formatSBC(`${v}`).replace(reg, '');
  // 格式化 '00.', '022' 类似 0 开头输入
  r = r.replace(/^(-?)(0)(\d*)(.*)/g, '$1$2$4');
  // 去除第一个 .
  r = r.replace(/^(-?)(\.)(.*)/, '$1$3');
  // 数字格式化，整数取前 maxDigit 位，小数取 precision 位
  return r.replace(
    new RegExp(`(-?\\d{0,${maxDigit}})(\\d*)(\\.?)(\\d{0,${precision}})(.*)`),
    '$1$3$4',
  );
};

// 全角数字、符号转换半角
util.formatSBC = (str) => {
  let tmp = '';
  for (let i = 0; i < str.length; i += 1) {
    if (+str.charCodeAt(i) === 12288) {
      tmp += String.fromCharCode(str.charCodeAt(i) - 12256);
    } else if (str.charCodeAt(i) > 65280 && str.charCodeAt(i) < 65375) {
      tmp += String.fromCharCode(str.charCodeAt(i) - 65248);
    } else {
      tmp += String.fromCharCode(str.charCodeAt(i));
    }
  }
  return tmp;
};

// 拷贝到剪切板
util.copyToClipboard = (text) => {
  const content = typeof text === 'string' ? text : String(text);

  const textField = document.createElement('textarea');
  textField.innerText = content;
  document.body.appendChild(textField);
  textField.select();
  document.execCommand('copy');
  textField.remove();
};

/** 数学计算 */
util.sum = (...args) => {
  let value = 0;
  for (let i = 0; i < args.length; i += 1) {
    const item = args[i];
    value += Number(item) || 0;
  }
  return value;
};

// 乘法计算
util.product = (...args) => {
  let r = Number(args[0]) || 0;
  for (let i = 1; i < args.length; i += 1) {
    const item = +args[i];
    if (!item) return 0;
    r = item ? r * item : r;
  }
  return r || 0;
};

// 除法 a/b
util.division = (a, b) => {
  const A = Number(a) || 0;
  const B = Number(b) || 1;

  if (A === 0 || B === 0) {
    return 0;
  }
  return A / B || 0;
};

/**
 * 获取时间戳格式
 * @param {} time 时间
 * @param {string} key startOf endOf
 * @param {} unit x=毫秒 X=秒
 * @param {} flag  day year month
 */
util.formatTime = (time, key, unit = 'X', flag = 'day') => {
  return Number(
    moment(time)
      [key](flag)
      .format(unit),
  );
};

export default util;
