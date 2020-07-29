// 修改密码弹窗
import React from 'react';
import { Modal, Form, message, Spin } from 'antd';
import { connect } from 'nuomi';
import { Base64 } from 'js-base64';
import PasswordCheck from '../../PasswordCheck';

import Style from './style.less';

const UpdatePassword = ({ loadings, visible, setVisible, code, dispatch, loginInfo, form }) => {
  const { validateFields } = form;

  // 点击重置密码
  const onOk = () => {
    validateFields((err, values) => {
      if (err) {
        return;
      }
      dispatch({
        type: '$updatePassword',
        payload: {
          code,
          phoneNum: loginInfo.phoneNum,
          password: Base64.encode(values.password),
          rePassword: Base64.encode(values.rePassword),
        },
      }).then(() => {
        message.success('密码重置成功');
        setVisible(false);
        // sso({}, this.dispatch);
      });
    });
  };

  // 关闭弹窗
  const onCancel = () => {
    setVisible(false);
  };

  return (
    <Modal
      visible={visible}
      title="温馨提示"
      width={474}
      centered
      maskClosable={false}
      className={Style['m-updatePassword']}
      okText="重置密码"
      onOk={onOk}
      onCancel={onCancel}
    >
      <Spin spinning={!!loadings.$updatePassword}>
        <div className={Style['m-hint']}>激活成功！为了保障您的账号安全，请进行密码重置</div>
        <Form>
          <PasswordCheck form={form} mode />
        </Form>
      </Spin>
    </Modal>
  );
};
export default connect(({ loadings, updatePasswordVisible, loginInfo }) => ({
  loadings,
  updatePasswordVisible,
  loginInfo,
}))(Form.create()(UpdatePassword));
