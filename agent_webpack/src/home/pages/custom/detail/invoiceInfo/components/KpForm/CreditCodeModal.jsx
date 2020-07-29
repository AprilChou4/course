import React from 'react';
import { connect } from 'nuomi';
import { Modal, Form, Input } from 'antd';
import './style.less';

const CreditCodeModal = ({ isShowCreditCodeModal, onClose, onSave, form, dispatch }) => {
  // 取消弹窗
  const handleCancel = () => {
    onClose();
    dispatch({
      type: 'updateState',
      payload: {
        isShowCreditCodeModal: false,
      },
    });
  };

  // 提交
  const handleOk = () => {
    form.validateFields(async (err, values) => {
      if (err) return;
      await dispatch({
        type: 'saveCreditCode',
        payload: {
          unifiedSocialCreditCode: values.creditCode,
        },
      });
      onSave();
      form.resetFields();
    });
  };

  const { getFieldDecorator } = form;
  return (
    <Modal
      className="kpform-credit-code-modal"
      width="460px"
      title="温馨提示"
      visible={isShowCreditCodeModal}
      onOk={handleOk}
      onCancel={handleCancel}
      maskClosable={false}
    >
      <p styleName="tip-text">缺少统一社会信用代码，请完善信息</p>
      <Form>
        <Form.Item label="信用代码" labelCol={{ span: 5 }} wrapperCol={{ span: 18 }}>
          {getFieldDecorator('creditCode', {
            rules: [
              {
                required: true,
                message: '请输入统一社会信用代码',
              },
              {
                pattern: /^[a-zA-Z0-9]{15,20}$/,
                message: '格式有误，须为15~20位数字、字母',
              },
            ],
          })(<Input placeholder="请输入统一社会信用代码" autoComplete="off" />)}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Form.create()(
  connect(({ isShowCreditCodeModal }) => ({
    isShowCreditCodeModal,
  }))(CreditCodeModal),
);
