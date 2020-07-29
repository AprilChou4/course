import React from 'react';
import { Menu } from 'antd';
import { connect } from 'nuomi';
import sso from '@login/public/sso';
import trackEvent from 'trackEvent';
import Register from '../RegisterModal'; // 注册
import Login from '../LoginModal'; // 登录
import ChooseCompany from '../ChooseCompany'; // 选择企业
import ActiveModal from '../ActiveModal'; // 激活企业
import CompleteInfo from '../CompleteInfo'; // 完善信息弹窗
import JoinCompany from '../JoinCompany';
import Style from './style.less';

const Header = ({ dispatch, isFixed = false, currtPage, isLoginStatus }) => {
  // 进入软件
  const gotoSoft = () => {
    sso({}, dispatch);
  };

  // 诺诺网点击量
  const nuoClicks = () => {
    trackEvent('nav', 'click', '云代账首页诺诺网链接点击量'); // 事件埋点
    _hmt.push(['_setAccount', 'b42dd2b9e92587f24b252f06b44086a6']);
  };

  // 云代账点击量
  const dzClicks = () => {
    trackEvent('nav', 'click', '云代账按钮点击量');
    _hmt.push(['_setAccount', 'b42dd2b9e92587f24b252f06b44086a6']);
  };
  return (
    <header className={`${Style['l-header']} ${isFixed ? Style['m-fixed'] : ''} `}>
      <div className={`${Style['m-logo']} ${Style[`m-logo-${currtPage}`]}`} />
      <div className={Style['m-right']}>
        <Menu
          selectedKeys={[currtPage]}
          mode="horizontal"
          className={`f-fl ${Style['m-productList']}`}
        >
          <Menu.Item key="home">
            <a href="/" rel="noopener noreferrer">
              首页
            </a>
          </Menu.Item>
          <Menu.Item key="personal">
            <a href="/personal.html" rel="noopener noreferrer" onClick={dzClicks}>
              云记账
            </a>
          </Menu.Item>
          <Menu.Item key="agent">
            <a href="/agent.html" rel="noopener noreferrer">
              云代账
            </a>
          </Menu.Item>
          <Menu.Item key="zhs">
            <a href="https://sds.jss.com.cn" rel="noopener noreferrer">
              智汇算
            </a>
          </Menu.Item>
        </Menu>
        <div className={`f-fl ${Style['m-operate']}`}>
          {/* {!isLoginStatus && (
            <> */}
          <Register currtPage={currtPage} className={isLoginStatus ? Style['f-dn'] : ''} />
          <Login currtPage={currtPage} className={isLoginStatus ? Style['f-dn'] : ''} />
          {/* </>
          )} */}
          <a
            href="//www.jss.com.cn/"
            className={Style['m-nuonuo']}
            target="_black"
            onClick={nuoClicks}
          >
            诺诺网
          </a>
          <ChooseCompany />
          <ActiveModal />
          <CompleteInfo />
          <JoinCompany />
          {isLoginStatus && <a onClick={gotoSoft}>进入软件</a>}
        </div>
      </div>
    </header>
  );
};
// Header.PropTypes = {
//   isFixed: PropTypes.bool,
//   selectedKeys: PropTypes.array,
// };

export default connect(({ isLoginStatus }) => ({ isLoginStatus }))(Header);
