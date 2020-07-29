import React from 'react';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import { connect } from 'nuomi';
import Header from '../Header';
import Side from '../Side';
import Content from '../Content';
import { LoadData } from '../Loading';

const Layout = ({ children, loadings: { loading } }) => {
  return (
    <ConfigProvider locale={zhCN}>
      <>
        {!!loading && <LoadData loading={loading} />}
        <Header />
        <div>
          <Side />
          <Content>{children}</Content>
        </div>
      </>
    </ConfigProvider>
  );
};

export default connect(({ loadings }) => ({ loadings }))(Layout);
