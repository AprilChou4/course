// 设置cookIE
const setCookie = (name, value, exdays) => {
  var d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  var expires = 'expires=' + d.toGMTString();
  document.cookie = name + '=' + value + '; ' + expires;
  //   console.log('setCookie');
  //   document.cookie = `${name}=${value}`;
};

// 获取cookie
const getCookie = (cname) => {
  var name = cname + '=';
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i].trim();
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return '';
};

// 移除cookie
const removeCookie = (name) => {
  document.cookie = name + '=expires=' + new Date();
};
export { setCookie, getCookie, removeCookie };
