import React, { useCallback } from 'react';
import { connect } from 'nuomi';
import StopStaff from '@pages/staff/components/StopStaff';

const Add = ({ visible, data, stopStaffLoading, dispatch }) => {
  const handleCancel = useCallback(() => {
    dispatch({
      type: 'hideStopStaffModal',
    });
  }, [dispatch]);

  const handleOk = useCallback(() => {
    // 关闭弹窗
    dispatch({
      type: '$stopStaff',
    });
  }, [dispatch]);

  return (
    <StopStaff
      visible={visible}
      confirmLoading={stopStaffLoading}
      data={data}
      onCancel={handleCancel}
      onOk={handleOk}
    />
  );
};

export default connect(
  ({ stopStaffModal: { visible, data }, loadings: { $stopStaff: stopStaffLoading } }) => ({
    visible,
    data,
    stopStaffLoading,
  }),
)(Add);
