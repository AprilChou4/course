/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import ReactDOM from 'react-dom';
import { Nuomi, Router, Redirect, router } from 'nuomi';
import pubData from 'data';
import globalServices from '@home/services';
import { sso, jsonParse, get } from '@utils';
import layout from './layout';
import routes from './public/routes';
import './public/config';
import './public/style/index.less';

// IE9用attachEvent
const eventListener = window.attachEvent ? 'attachEvent' : 'addEventListener';
const messageType = window.attachEvent ? 'onmessage' : 'message';
window[eventListener](
  messageType,
  ({ data }) => {
    const { type } = jsonParse(data);
    switch (type) {
      case 'agentAccount/refresh':
        // console.log(router.location().url, 'agentAccount/refresh');
        router.location(router.location().url);
        break;
      case 'agentAccount/reload':
        // console.log(router.location().url, 'agentAccount/reload');
        router.location(router.location().url, true);
        break;
      default:
    }
  },
  false,
);

// 获取用户信息
const getUserInfo = () => globalServices.getUserInfo({}, { errorMsg: '获取用户信息失败！' });

// 进入系统后的请求
async function initAsyncFunctions() {
  const {
    query: { isAlone },
  } = router.location();
  if (isAlone === '1') {
    await sso();
  }
  // 无继发关系的多个请求可以放在这里并发执行，避免不必要的阻塞
  const [userInfo] = await Promise.all([getUserInfo()]);

  if (userInfo) {
    const authority = {};
    const authorities = get(userInfo, 'authorities', '');
    authorities.split('#').forEach((val) => {
      if (val !== '') {
        authority[`${val}`] = '1';
      }
    });
    const userInfoType = get(userInfo, 'type');

    pubData.set('userInfo', userInfo);
    pubData.set('authority', authority);
    pubData.set('userInfo_company', get(userInfo, 'company')); // 当前企业信息
    pubData.set('userInfo_staffId', get(userInfo, 'staffId')); // 当前用户员工ID
    pubData.set('userInfo_userId', get(userInfo, 'userId')); // 当前用户ID
    pubData.set('userInfo_roleName', get(userInfo, 'roleName')); // 角色名称
    pubData.set('userInfo_type', userInfoType); // 1:超级管理员,2:经理，3:员工
    pubData.set('userInfo_isManage', userInfoType === 1); // 是否超级管理员
  }
}

(async () => {
  try {
    await initAsyncFunctions();

    // eslint-disable-next-line no-unused-expressions
    document.getElementById('globalLoading').remove
      ? document.getElementById('globalLoading').remove()
      : document.getElementById('globalLoading').removeNode(true);
  } catch (error) {
    console.error(error);
  } finally {
    ReactDOM.render(
      <Nuomi {...layout}>
        <Router>
          {routes}
          <Redirect to={routes[0].props.path} />
        </Router>
      </Nuomi>,
      document.getElementById('app'),
    );
  }
})();
