import React from 'react';
import { ContentWrapper } from '@components';
import Search from '../Search';
import Export from '../Export';
import MainContent from '../Content';
import ApproveStaffModal from '../ApproveStaffModal';

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
    <ApproveStaffModal />
  </>
);

export default Main;
