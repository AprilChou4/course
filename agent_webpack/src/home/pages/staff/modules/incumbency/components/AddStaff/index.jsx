import React, { useCallback } from 'react';
import { connect } from 'nuomi';

const AddEditStaff = ({ dispatch }) => {
  const handleClick = useCallback(() => {
    dispatch({
      type: 'showAddEditStaffModal',
      payload: {
        data: { staffModalType: 0 },
      },
    });
  }, [dispatch]);

  return <div onClick={handleClick}>新增员工</div>;
};

export default connect()(AddEditStaff);
