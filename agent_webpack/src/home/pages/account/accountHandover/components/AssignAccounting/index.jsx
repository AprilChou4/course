import React, { useState, useContext, useEffect, useCallback, useMemo, useRef } from 'react';
import { Modal } from 'antd';
import { connect } from 'nuomi';
import Content from './Content';

function Receive({ record, record: { recordId }, dispatch }) {
  const contentRef = useRef(null);

  const handleCancel = useCallback(() => {
    dispatch({
      type: 'updateAssignAccounting',
      payload: {
        visible: false,
      },
    });
  }, [dispatch]);

  const handleConfirm = useCallback(() => {
    const { form } = contentRef.current;
    form.validateFields((err, { bookkeepingAccounting, ...restValues }) => {
      if (err) {
        return;
      }
      const accountList = [];
      Object.keys(restValues).forEach((val) => {
        if (val.startsWith('accountName')) {
          accountList.push({
            accountId: val.split('-')[1],
            accountName: restValues[val],
          });
        }
      });

      dispatch({
        type: 'receive',
        payload: {
          recordId,
          accountList,
          bookkeepingAccounting,
        },
      });
    });
  }, [dispatch, recordId]);

  return (
    <Modal
      centered
      visible
      destroyOnClose
      title="指派记账会计"
      maskClosable={false}
      onCancel={handleCancel}
      onOk={handleConfirm}
      className="withForm"
    >
      <Content wrappedComponentRef={contentRef} data={{ record }} />
    </Modal>
  );
}

export default connect(({ assignAccounting: { record } }) => ({ record }))(Receive);
