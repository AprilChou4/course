import request from './req';

function GetQueryString(name) {
  const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`);
  const url = window.location.hash;
  const str = url.substring(url.indexOf('?') + 1);
  const r = str.match(reg);
  if (r !== null) {
    return unescape(r[2]);
  } // decodeURI();中文用这个
  return null;
}

export default function(isIframe = true) {
  if (isIframe) {
    return new Promise((resolve) => {
      const loginInfo = GetQueryString('loginInfo');
      // 如果相同的loginInfo请求过，就不在请求 fix: #132248
      const usedInfo = JSON.parse(localStorage.getItem('USED_LOGIN_INFO') || '[]');
      if (usedInfo.indexOf(loginInfo) > -1) {
        resolve();
        return;
      }
      request({
        // url: '/jz/sso/login.do',
        url: 'instead/v2/user/allow/sso/login.do',
        type: 'post',
        data: {
          encryptionLoginInfo: loginInfo,
          utoken: '',
        },
      }).then((res) => {
        const { status, data } = res;
        if (status === 200) {
          localStorage.setItem('USED_LOGIN_INFO', JSON.stringify([...usedInfo, loginInfo]));
          resolve(data);
        } else {
          resolve(res.message || '请检查网络连接是否正常！');
        }
      });
    });
  }
}
