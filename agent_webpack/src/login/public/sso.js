import { Base64 } from 'js-base64';
import { request } from 'nuijs';

const locationProduct = (data, dispatch) => {
  // 代账
  if (data.versionType === 1) {
    localStorage.setItem('versionType', '1');
    location.replace(`${basePath}cloud/index.html`);
  } else if (data.versionType === 0) {
    // 记账
    localStorage.setItem('versionType', 0);
    // 单账套直接跳转工作台
    if (data.defaultAccount && data.defaultAccount.accountId) {
      // && data.defaultId
      let html = 'platform.html';
      if (data.defaultAccount.accountSource === '1') {
        html = 'accounting.html';
      }
      location.replace(`${basePath + html}?id=${data.defaultAccount.accountId}`);
    } else {
      location.replace(`${basePath}accounts.html`);
    }
  } else {
    dispatch({
      type: 'agentAccount_login_layout/updateState',
      payload: {
        chooseCompanyVisible: true,
        isLoginStatus: true,
      },
    });
  }
};

export default function(data = {}, dispatch) {
  request(
    {
      type: 'get',
      url: `${ssoUrl}u/v1/auth/check_login`,
      ext: false,
      data: {
        resfunc: data.resfunc,
      },
      dataType: 'jsonp',
      jsonp: 'callback',
      jsonpCallback: 'user_lbn_jsonpResponse',
      timeout: 30000,
      success(result) {
        // 登录或者注册后跳转
        if (data.resfunc) {
          locationProduct(data, dispatch);
        }
        // 单点登录跳转
        else {
          const { code } = result;
          const tokenJson = result.data;
          if (tokenJson && code === 200) {
            let referer = location.search.replace(/^\?referer=/, '');
            if (referer) {
              referer = Base64.decode(referer);
              if (referer.indexOf(`${location.protocol}//${location.host}`) !== 0) {
                referer = '';
              }
            }
            request.post(
              'instead/v2/user/allow/sso/login.do',
              {
                url: referer,
                utoken: tokenJson.token,
              },
              {
                200: async (res) => {
                  if (res.data && res.data.newUser) {
                    // 获取单点登录信息
                    const res1 = await request.get('instead/v2/user/allow/getCompleteUserInfo.do');
                    dispatch({
                      type: 'agentAccount_login_layout/updateState',
                      payload: {
                        completeInfoVisible: true,
                        loginVisible: false,
                        isLoginStatus: true,
                        loginInfo: res1.data,
                      },
                    });
                    return false;
                  }
                  // 从哪来到哪去
                  if (referer) {
                    location.replace(referer);
                  } else {
                    locationProduct(res.data, dispatch);
                  }
                },
                // 待申请
                306: (res) => {
                  dispatch({
                    type: 'agentAccount_login_layout/updateState',
                    payload: {
                      completeInfoVisible: false,
                      chooseCompanyVisible: true,
                      companyList: res.data,
                    },
                  });
                },
                // 未激活
                304: (res) => {
                  dispatch({
                    type: 'agentAccount_login_layout/updateState',
                    payload: {
                      completeInfoVisible: false,
                      chooseCompanyVisible: true,
                      companyList: res.data,
                    },
                  });
                },
              },
              '正在登录...',
            );
          }
        }
        // dispatch({
        //   type: 'updateState',
        //   payload: {
        //     isLoginStatus: true,
        //   },
        // });
      },
    },
    null,
  );
}
