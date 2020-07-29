import React from 'react';
import { connect } from 'nuomi';
import { Layout, ContentWrapper } from '@components';
import Operations from '../Operations';
import Content from '../Content';

const Main = ({ title }) => {
  return (
    <Layout.PageWrapper>
      <ContentWrapper
        isPageHeader
        title={title}
        header={{
          right: <Operations />,
        }}
        content={<Content />}
      />
    </Layout.PageWrapper>
  );
};

export default connect(({ title }) => ({ title }))(Main);
