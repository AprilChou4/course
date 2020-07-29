import React, { useCallback, useRef } from 'react';
import { connect } from 'nuomi';
import moment from 'moment';
import { AntdModal } from '@components';
import Content from './Content';

const MonthFormat = 'YYYY-MM';

const EditAccount = ({ visible, record, record: { accountId, customerId }, dispatch }) => {
  const contentRef = useRef(null);

  const handleCancel = useCallback(() => {
    dispatch({
      type: 'updateEditAccount',
      payload: {
        visible: false,
      },
    });
  }, [dispatch]);

  const handleConfirm = useCallback(() => {
    const { form } = contentRef.current;
    form.validateFields((err, { createTime, accounting, businessPattern, vatType, ...rest }) => {
      if (err) {
        return;
      }
      const payload = {
        accountId,
        customerId,
        ...rest,
        createTime: moment(createTime).format(MonthFormat),
        accounting: Number(accounting),
        businessPattern: Number(businessPattern),
        vatType: Number(vatType),
      };
      dispatch({
        type: 'editAccount',
        payload,
      });
    });
  }, [accountId, customerId, dispatch]);

  return (
    <AntdModal
      title="编辑账套"
      className="withForm"
      width={850}
      getContainer={false}
      visible={visible}
      onCancel={handleCancel}
      onOk={handleConfirm}
    >
      <Content wrappedComponentRef={contentRef} data={{ record }} />
    </AntdModal>
  );
};

export default connect(({ editAccount: { visible, record } }) => ({
  visible,
  record,
}))(EditAccount);
