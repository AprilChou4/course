import React from 'react';
import { ContentWrapper, DropdownButton } from '@components';
import pubData from 'data';
import AddEditStaffModal from '../AddEditStaffModal';
import AdminEditSelfModal from '../AdminEditSelfModal';
import AddDeptModal from '../AddDeptModal';
import EditDeptModal from '../EditDeptModal';
import StopStaffModal from '../StopStaffModal';
import AddStaff from '../AddStaff';
// import ImportStaff from '../ImportStaff';
import CustomImport from '../CustomImport/Batch';
import Search from '../Search';
import Export from '../Export';
import MainContent from '../Content';

const userAuth = pubData.get('authority');

const Main = () => (
  <>
    <ContentWrapper
      isPageHeader
      header={{
        left: <Search />,
        right: (
          <>
            <DropdownButton>
              {userAuth[37] && <AddStaff />}
              {userAuth[38] && <CustomImport />}
            </DropdownButton>
            <Export />
          </>
        ),
      }}
      content={<MainContent />}
    />
    <AddEditStaffModal />
    <AdminEditSelfModal />
    <AddDeptModal />
    <EditDeptModal />
    <StopStaffModal />
  </>
);

export default Main;
