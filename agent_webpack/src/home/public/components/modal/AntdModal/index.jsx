import React from 'react';
import { Modal } from 'antd';
import classnames from 'classnames';
import './style.less';

/**
 *在Antd Modal的基础上设置一些默认值和样式
 *
 * @param {*} { children, ...props }
 * @returns
 */
const AntdModal = ({ children, className, ...props }) => {
  return (
    <Modal
      centered
      destroyOnClose
      title="温馨提示"
      maskClosable={false}
      className={classnames('antd-modal', className)}
      {...props}
    >
      {children}
    </Modal>
  );
};

export default AntdModal;
