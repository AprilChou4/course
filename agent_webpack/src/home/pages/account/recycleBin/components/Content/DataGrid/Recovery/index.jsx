import React, { useState, useCallback, useRef } from 'react';
import { connect } from 'nuomi';
import { AntdModal, LinkButton, ShowConfirm } from '@components';
import Content from './Content';

const Recovery = ({
  data: {
    record: { accountId, accountName = '' },
  },
  dispatch,
}) => {
  const [visible, setVisible] = useState(false);
  const contentRef = useRef(null);

  const handleRecover = useCallback(() => {
    ShowConfirm({
      title: `确定恢复账套“${accountName}”吗？`,
      async onOk() {
        const data = await dispatch({
          type: 'recover',
          payload: {
            accountId,
            accountName,
          },
        });
        if (!data) return;

        // 账套名重复，选择客户名称
        if (data.status === 400) {
          setVisible(true);
        }
      },
    });
  }, [accountId, accountName, dispatch]);

  const handleCancel = () => {
    setVisible(false);
  };

  const handleConfirm = useCallback(() => {
    const { form, unCreateCustomerList } = contentRef.current;
    if (!unCreateCustomerList.length) {
      setVisible(false);
      return;
    }
    form.validateFields((err, { customerId }) => {
      if (err) {
        return;
      }
      dispatch({
        type: 'recover',
        payload: {
          accountId,
          customerId,
        },
      });
    });
  }, [accountId, dispatch]);

  return (
    <>
      <LinkButton onClick={handleRecover}>恢复</LinkButton>
      <AntdModal
        title="恢复账套"
        width={535}
        visible={visible}
        onCancel={handleCancel}
        onOk={handleConfirm}
      >
        <Content wrappedComponentRef={contentRef} dispatch={dispatch} />
      </AntdModal>
    </>
  );
};

export default connect()(Recovery);
