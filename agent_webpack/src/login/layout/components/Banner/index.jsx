import React from 'react';
import { Button } from 'antd';
import { connect } from 'nuomi';
import trackEvent from 'trackEvent';
import Style from './style.less';

const Banner = ({ dispatch, type = 2 }) => {
  const classname = ['banner-cloud', 'banner-instead', 'banner-index'][type];
  // 立即体验
  const login = () => {
    if (type === 1) {
      trackEvent('nav', 'click', '云代账立即体验按钮点击量');
      _hmt.push(['_setAccount', 'b42dd2b9e92587f24b252f06b44086a6']);
    }

    dispatch({
      type: 'agentAccount_login_layout/updateState',
      payload: {
        loginVisible: true,
        versionType: type,
      },
    });
  };

  // 滚动下拉
  const scroll = () => {
    window.scrollTo({
      top: 475,
      behavior: 'smooth',
    });
  };
  return (
    <div className={`${Style['m-banner']} ${Style[classname]}`}>
      {type !== 2 && (
        <span className={Style['m-experienceNow']}>
          <Button size="large" onClick={login}>
            即刻体验
          </Button>
          <i className="iconfont" onClick={scroll}>
            &#xe636;
          </i>
        </span>
      )}
    </div>
  );
};
Banner.defaultProps = {
  // 2=默认首页 0=记账 1=代账
  type: 2,
};
export default connect()(Banner);
