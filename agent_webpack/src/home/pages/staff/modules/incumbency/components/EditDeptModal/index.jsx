import React, { useCallback } from 'react';
import { connect } from 'nuomi';
import EditDept from '@pages/staff/components/EditDept';

const Edit = ({ visible, data, editDeptLoading, dispatch }) => {
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
    <EditDept
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
)(Edit);
