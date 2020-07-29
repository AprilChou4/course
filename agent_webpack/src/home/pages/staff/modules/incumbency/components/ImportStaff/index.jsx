import React, { useCallback } from 'react';
import { Button } from 'antd';
import { connect } from 'nuomi';

const AddEditStaff = ({ dispatch }) => {
  const handleClick = useCallback(() => {
    dispatch({
      type: 'updateState',
    });
  }, [dispatch]);

  return (
    <Button type="primary" onClick={handleClick}>
      批量导入
    </Button>
  );
};

export default connect()(AddEditStaff);
