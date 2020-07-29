import React, { useCallback } from 'react';
import { connect } from 'nuomi';
import AddDept from '@pages/staff/components/AddDept';
import { trim } from '@utils';

const Add = ({ visible, data, addDeptLoading, dispatch }) => {
  const handleCancel = useCallback(() => {
    dispatch({
      type: 'hideAddDeptModal',
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
          type: '$addDept',
          payload: {
            ...values,
            deptNames: values.deptNames.split('\n').filter((val) => trim(val)),
          },
        });
      });
    },
    [dispatch],
  );

  return (
    <AddDept
      visible={visible}
      confirmLoading={addDeptLoading}
      data={data}
      onCancel={handleCancel}
      onOk={handleOk}
    />
  );
};

export default connect(
  ({ addDeptModal: { visible, data }, loadings: { $addDept: addDeptLoading } }) => ({
    visible,
    data,
    addDeptLoading,
  }),
)(Add);
