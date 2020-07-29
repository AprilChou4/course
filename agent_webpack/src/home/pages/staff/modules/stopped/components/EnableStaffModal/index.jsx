import React, { useCallback } from 'react';
import { connect } from 'nuomi';
import EnableStaff from '@pages/staff/components/EnableStaff';
import { get } from '@utils';

const EnableStaffModal = ({ visible, data, enableStaffLoading, dispatch }) => {
  const handleCancel = useCallback(() => {
    dispatch({
      type: 'hideEnableStaffModal',
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
          type: '$enableStaffPro',
          payload: values,
        });
      });
    },
    [dispatch],
  );

  return (
    <EnableStaff
      title="启用员工"
      cancelText="关闭"
      okText="启用"
      visible={visible}
      data={data}
      onCancel={handleCancel}
      onOk={handleOk}
      confirmLoading={enableStaffLoading}
      bodyStyle={{ maxHeight: 500, overflow: 'auto' }}
    />
  );
};

export default connect(
  ({ enableStaffModal: { visible, data }, loadings: { $enableStaffPro: enableStaffLoading } }) => ({
    visible,
    data,
    enableStaffLoading,
  }),
)(EnableStaffModal);
