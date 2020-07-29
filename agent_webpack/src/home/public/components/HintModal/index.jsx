import React from 'react';
import { Modal, message } from 'antd';
import ProgressBar from '@components/ProgressBar';
import './style.less';

/**
 * 进度条 弹层
 * subtitle = 进度条名称
 * msg = 进度条提示信息名称
 * callback = 回调
 */
const progressModal = (subtitle, msg, callback) => {
  const modal = Modal.confirm({
    className: 'ui-progressModal',
    width: 420,
    centered: true,
    icon: null,
    title: null,
    okButtonProps: {
      className: 'f-dn',
    },
    content: <ProgressBar subtitle={subtitle} msg={msg} />,
  });
  modal.hide = () => {
    modal.destroy();
  };
  modal.upend = (cbk, text) => {
    modal.update({
      content: <ProgressBar subtitle={subtitle} msg={msg} fig />,
    });
    if (cbk) {
      cbk();
    } else {
      setTimeout(() => {
        message.success(text || '备份成功');
        modal.hide();
      }, 100);
    }
  };
  if (callback) {
    callback(modal);
    return false;
  }
  modal.hide();
};
export { progressModal };
