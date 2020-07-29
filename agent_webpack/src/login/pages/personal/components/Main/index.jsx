import React from 'react';
// import { ConfigProvider } from 'antd';
// import Header from '@loginComponents/Header';
import Banner from '@login/layout/components/Banner';
// import Layout from '@loginComponents/Layout';
import Intro from '../Intro';

const Main = () => {
  return (
    // <Layout type={1}>
    //   <Banner type={1} />
    //   <Intro />
    // </Layout>
    <>
      <Banner type={0} />
      <Intro />
    </>
  );
};

export default Main;
