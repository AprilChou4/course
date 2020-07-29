import React, { useCallback, useMemo } from 'react';
import { connect } from 'nuomi';
import HandleStaff from '@pages/staff/components/HandleStaff';
import { dictionary } from '@pages/staff/utils';
import { ShowConfirm } from '@components';
import { get, isEqual, omitBy, isNil } from '@utils';

const AddEditStaffModal = ({ visible, data, addStaffLoading, editStaffLoading, dispatch }) => {
  const staffModalType = useMemo(() => get(data, 'staffModalType'), [data]);
  const isEdit = staffModalType === 1;

  const modalTitle = useMemo(() => `${dictionary.staffModalType.map[staffModalType] || '-'}`, [
    staffModalType,
  ]);

  const hideAddEditStaffModal = useCallback(() => {
    dispatch({
      type: 'hideAddEditStaffModal',
    });
  }, [dispatch]);

  const handleCancel = useCallback(
    ({ form, initData }) => {
      const formValues = form.getFieldsValue();
      if (!isEqual(omitBy(initData, isNil), omitBy(formValues, isNil))) {
        ShowConfirm({
          title: '员工信息尚未保存，是否确定取消?',
          onOk() {
            hideAddEditStaffModal();
          },
        });
        return;
      }
      hideAddEditStaffModal();
    },
    [hideAddEditStaffModal],
  );

  const handleOk = useCallback(
    ({ form }) => {
      // 关闭弹窗
      form.validateFields((err, values) => {
        if (err) {
          return;
        }
        const { staffId, dept, deptRowKeys = [], roleIds, ...restValues } = values;
        const params = {
          ...restValues,
          ...(isEdit ? { staffId } : {}),
          roleIds: roleIds.join(','),
          deptIds: deptRowKeys
            .map((key) => dept[key].id)
            .filter(Boolean)
            .join(','),
          type: dept[0].type,
        };
        dispatch({
          type: isEdit ? '$editStaff' : '$addStaff',
          payload: {
            staffModalType,
            formValues: params,
          },
        });
      });
    },
    [dispatch, isEdit, staffModalType],
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
      confirmLoading={isEdit ? editStaffLoading : addStaffLoading}
    />
  );
};

export default connect(
  ({
    addEditStaffModal: { visible, data },
    loadings: { $addStaff: addStaffLoading, $editStaff: editStaffLoading },
  }) => ({
    visible,
    data,
    addStaffLoading,
    editStaffLoading,
  }),
)(AddEditStaffModal);
