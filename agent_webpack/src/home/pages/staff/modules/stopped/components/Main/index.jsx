import React from 'react';
import { ContentWrapper } from '@components';
import Search from '../Search';
import Export from '../Export';
import MainContent from '../Content';
import EnableStaffModal from '../EnableStaffModal';

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
    <EnableStaffModal />
  </>
);

export default Main;
