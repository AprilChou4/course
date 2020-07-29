import React, { useCallback } from 'react';
import HandleStaff from '@pages/staff/components/HandleStaff';
import { connect } from 'nuomi';

const AddEditStaffModal = ({ visible, data, editDeptLoading, dispatch }) => {
  const handleCancel = useCallback(() => {
    dispatch({
      type: 'hideEditDeptModal',
    });
  }, [dispatch]);

  const handleOk = useCallback(
    ({ form }) => {
      // 关闭弹窗
      form.validateFields((err, values) => {
        if (err) {
          return;
        }
        dispatch({
          type: '$editDept',
          payload: values,
        });
      });
    },
    [dispatch],
  );

  return (
    <HandleStaff
      visible={visible}
      confirmLoading={editDeptLoading}
      data={data}
      onCancel={handleCancel}
      onOk={handleOk}
    />
  );
};

export default connect(
  ({ editDeptModal: { visible, data }, loadings: { $editDept: editDeptLoading } }) => ({
    visible,
    data,
    editDeptLoading,
  }),
)(AddEditStaffModal);
