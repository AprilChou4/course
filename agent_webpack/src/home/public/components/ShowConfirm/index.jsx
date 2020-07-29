import React from 'react';
import { Modal, Icon } from 'antd';
import classnames from 'classnames';
import './style.less';
/**
 *
 * @param {配置参数} options
 * @param {配置参数} type warning/confirm/success/info
 */

const types = {
  success: <Icon type="check-circle" theme="filled" />,
  warning: <Icon type="exclamation-circle" theme="filled" />,
  confirm: <Icon type="exclamation-circle" theme="filled" />,
};

const ShowConfirm = ({ className, type = 'confirm', ...rest }) => {
  const modal = Modal[type]({
    icon: types[type],
    centered: true,
    width: 'auto', // 宽度自适应，最大宽度400（在样式里控制了）
    ...rest,
    className: classnames('dialog-confirm', className),
  });
  // 返回实例
  return modal;
};

export default ShowConfirm;
