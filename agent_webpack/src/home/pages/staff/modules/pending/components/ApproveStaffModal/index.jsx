import React, { useCallback } from 'react';
import { connect } from 'nuomi';
import HandleStaff from '@pages/staff/components/HandleStaff';
import { ShowConfirm } from '@components';
import { isEqual, omitBy, isNil } from '@utils';

const AddEditStaffModal = ({ visible, data, approveStaffLoading, dispatch }) => {
  // const staffModalType = useMemo(() => get(data, 'staffModalType'), [data]);
  // const isEdit = staffModalType === 1;

  const hideApproveStaffModal = useCallback(() => {
    dispatch({
      type: 'hideApproveStaffModal',
    });
  }, [dispatch]);

  const handleCancel = useCallback(
    ({ form, initData }) => {
      const formValues = form.getFieldsValue();
      if (!isEqual(omitBy(initData, isNil), omitBy(formValues, isNil))) {
        ShowConfirm({
          title: '员工信息尚未保存，是否确定取消?',
          onOk() {
            hideApproveStaffModal();
          },
        });
        return;
      }
      hideApproveStaffModal();
    },
    [hideApproveStaffModal],
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
          userJoinCompanyId: staffId,
          roleIds: roleIds.join(','),
          deptIds: deptRowKeys
            .map((key) => dept[key].id)
            .filter(Boolean)
            .join(','),
          type: dept[0].type,
        };
        dispatch({
          type: '$approveStaff',
          payload: params,
        });
      });
    },
    [dispatch],
  );

  return (
    <HandleStaff
      title="同意审批"
      okText="保存"
      visible={visible}
      data={data}
      onCancel={handleCancel}
      onOk={handleOk}
      confirmLoading={approveStaffLoading}
      bodyStyle={{ maxHeight: 500, overflow: 'auto' }}
    />
  );
};

export default connect(
  ({ approveStaffModal: { visible, data }, loadings: { $approveStaff: approveStaffLoading } }) => ({
    visible,
    data,
    approveStaffLoading,
  }),
)(AddEditStaffModal);
