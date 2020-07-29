// 登录弹窗
import React from 'react';
import { Modal, Spin } from 'antd';
import { connect } from 'nuomi';
import LoginForm from './LoginForm';

import Style from './style.less';

const LoginModal = ({ currtPage, title = '登录', className, dispatch, loadings, loginVisible }) => {
  // 点击登录
  const login = () => {
    // 待优化、、和注册代码一致
    let type = 2;
    ['personal', 'agent', 'home'].forEach((item, key) => {
      if (item === currtPage) {
        type = key;
      }
    });
    dispatch({
      type: 'updateState',
      payload: {
        loginVisible: true,
        versionType: type,
      },
    });
  };

  // 关闭弹窗
  const onCancel = () => {
    dispatch({
      type: 'updateState',
      payload: {
        loginVisible: false,
      },
    });
  };

  return (
    <>
      <a onClick={login} className={className}>
        {title}
      </a>
      {/* {loginVisible && ( */}
      <Modal
        visible={loginVisible}
        width={400}
        height={440}
        centered
        maskClosable={false}
        destroyOnClose
        className={Style['m-loginModal']}
        footer={null}
        onCancel={onCancel}
      >
        <Spin spinning={!!loadings.$userLogin}>
          <div className={Style['m-title']}>{title}</div>
          <LoginForm />
        </Spin>
      </Modal>
      {/* )} */}
    </>
  );
};
export default connect(({ loginVisible, loadings }) => ({
  loginVisible,
  loadings,
}))(LoginModal);
