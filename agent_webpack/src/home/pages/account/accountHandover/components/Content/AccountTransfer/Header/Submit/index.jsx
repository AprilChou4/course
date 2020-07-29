import React, { useState, useContext, useEffect, useCallback, useMemo } from 'react';
import { connect } from 'nuomi';
import { AntdModal } from '@components';
import Content from './Content';

const Submit = ({ visible, submitData, afterSubmit, dispatch }) => {
  const handleCancel = useCallback(() => {
    dispatch({
      type: 'updateTransferSubmit',
      payload: {
        visible: false,
      },
    });
  }, [dispatch]);

  const handleConfirm = useCallback(async () => {
    const {
      name,
      accountList,
      companyData: { staffId, companyId, realName, versionType },
    } = submitData;
    const accList = accountList.map(({ key, label }) => ({
      accountId: key,
      accountName: label,
    }));
    const params = {
      name,
      realName,
      recipientId: staffId,
      accountList: accList,
      companyId: versionType === '0' ? undefined : companyId, // 如果移交人是记账用户 不传companyId
    };
    const res = await dispatch({
      type: 'transfer',
      payload: params,
    });
    if (!res) return;

    handleCancel();
    // 清空表单
    afterSubmit && afterSubmit();
  }, [afterSubmit, dispatch, handleCancel, submitData]);

  return (
    <AntdModal visible={visible} onCancel={handleCancel} onOk={handleConfirm}>
      <Content data={{ submitData }} />
    </AntdModal>
  );
};

export default connect(({ transferSubmit: { visible, submitData } }) => ({
  visible,
  submitData,
}))(Submit);
