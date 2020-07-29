import React from 'react';
import { useWindowScroll } from 'react-use';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import Header from '../Header';
import Fixed from '../Fixed';
import Style from './style.less';

const Layout = ({ children, type = 0 }) => {
  const currtPage = ['personal', 'agent', 'home'][type];
  const isFixed = type !== 2;
  const { y } = useWindowScroll();
  return (
    <ConfigProvider locale={zhCN}>
      {/* {!!loading && <LoadData loading={loading} />} */}
      <Header isFixed={isFixed || y >= 100} currtPage={currtPage} />
      <div className={` ${Style['l-content']}`}>{children}</div>
      <Fixed />
    </ConfigProvider>
  );
};

export default Layout;
