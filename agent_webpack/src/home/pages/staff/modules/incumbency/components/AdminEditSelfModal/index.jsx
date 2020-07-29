/**
 * 管理员修改自己的员工信息弹窗
 */
import React, { useCallback, useMemo } from 'react';
import { connect } from 'nuomi';
import HandleStaff from '@pages/staff/components/HandleStaff';
import { dictionary } from '@pages/staff/utils';
import { ShowConfirm } from '@components';
import { get, isEqual, omitBy, isNil } from '@utils';

const AdminEditSelfModal = ({ visible, data, editStaffLoading, dispatch }) => {
  const staffModalType = useMemo(() => get(data, 'staffModalType'), [data]);

  const modalTitle = useMemo(() => `${dictionary.staffModalType.map[staffModalType] || '-'}`, [
    staffModalType,
  ]);

  const hideAdminEditSelfModal = useCallback(() => {
    dispatch({
      type: 'hideAdminEditSelfModal',
    });
  }, [dispatch]);

  const handleCancel = useCallback(
    ({ form, initData }) => {
      const formValues = form.getFieldsValue();
      if (!isEqual(omitBy(initData, isNil), omitBy(formValues, isNil))) {
        ShowConfirm({
          title: '员工信息尚未保存，是否确定取消?',
          onOk() {
            hideAdminEditSelfModal();
          },
        });
        return;
      }
      hideAdminEditSelfModal();
    },
    [hideAdminEditSelfModal],
  );

  const handleOk = useCallback(
    ({ form }) => {
      // 关闭弹窗
      form.validateFields((err, values) => {
        if (err) {
          return;
        }
        dispatch({
          type: '$editStaff',
          payload: {
            staffModalType,
            formValues: values,
          },
        });
      });
    },
    [dispatch, staffModalType],
  );

  return (
    <HandleStaff
      okText="保存"
      bodyStyle={{ maxHeight: 500, overflow: 'auto' }}
      title={modalTitle}
      visible={visible}
      data={data}
      onCancel={handleCancel}
      onOk={handleOk}
      confirmLoading={editStaffLoading}
    />
  );
};

export default connect(
  ({ adminEditSelfModal: { visible, data }, loadings: { $editStaff: editStaffLoading } }) => ({
    visible,
    data,
    editStaffLoading,
  }),
)(AdminEditSelfModal);
