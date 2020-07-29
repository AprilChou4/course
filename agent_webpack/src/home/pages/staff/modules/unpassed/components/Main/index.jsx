import React from 'react';
import { ContentWrapper } from '@components';
import Search from '../Search';
import Export from '../Export';
import MainContent from '../Content';

const Main = () => (
  <>
    <ContentWrapper
      isPageHeader
      header={{
        left: <Search />,
        right: (
          <>
            <Export />
          </>
        ),
      }}
      content={<MainContent />}
    />
  </>
);

export default Main;
