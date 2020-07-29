import pubData from 'data';
import { message } from 'antd';
import dictionary from './dictionary';
import role from './role';

const authoritys = pubData.get('authority');
const userid = pubData.get('userInfo_userId');

const openUrl = (data, path = 'home') => {
  if (authoritys['236']) {
    if (data.transfer) {
      message.error('账套交接中，请先完成交接');
      return;
    }
    if (data.status === 1) {
      message.error('账套已被停用，请先恢复账套');
      return;
    }
    let url;
    if (data.accountSource !== 1) {
      url = `/platform.html`;
    }
    // 新版
    else {
      url = `/accounting.html`;
    }
    const a = document.createElement('a');
    const span = document.createElement('span');
    a.appendChild(span);
    a.href = `${url}?id=${data.accountId}#!/${path}`;
    a.target = '_blank';
    document.body.appendChild(a);
    span.click();
    a.remove();
  } else {
    message.error('您无权打开记账平台');
  }
};

const storeForUser = (...args) => {
  const [name, storeData] = args;
  const data = JSON.parse(localStorage.getItem(name) || '{}');
  if (args.length > 1) {
    data[userid] = storeData;
    localStorage.setItem(name, JSON.stringify(data));
  } else {
    return data[userid];
  }
};

export { role, authoritys, openUrl, dictionary, storeForUser };
