// 首页悬浮框
import React from 'react';
import { useWindowScroll } from 'react-use';
import { Popover, BackTop } from 'antd';
import { connect } from 'nuomi';
import Style from './style.less';

const Fixed = () => {
  const { y } = useWindowScroll();
  const content = (
    <div className={Style['m-contact']}>
      <em>人工咨询热线</em>
      <h3>400-700-8892转3</h3>
    </div>
  );
  return (
    <div className={`${Style['m-floatNav']} ${y <= 500 ? Style['m-floatTop'] : ''}`}>
      <a className={Style['m-item']}>
        <Popover
          placement="left"
          content={content}
          title={null}
          trigger="hover"
          className={Style['m-c']}
        >
          <em>人工咨询</em>
          <i className="iconfont">&#xebe0;</i>
        </Popover>
      </a>
      <a
        className={Style['m-item']}
        href="//robot.jss.com.cn/pc.do?newKey=kwy6d386c7566304a685742516c67636e6651755a454b773d3d"
        target="_blank"
        rel="noopener noreferrer"
      >
        <em>智能客服</em>
        <i className="iconfont">&#xe698;</i>
      </a>
      <BackTop>
        <div className={`${Style['m-item']} ${Style['m-top']}`}>返回顶部</div>
      </BackTop>
    </div>
  );
};
export default connect()(Fixed);
