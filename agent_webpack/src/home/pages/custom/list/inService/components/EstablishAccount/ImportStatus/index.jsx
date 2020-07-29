import React, { Component } from 'react';
import { Modal, message } from 'antd';
import { progressModal } from '@components/HintModal';
import services from '../../../services';
/**
 * 进度条 弹层
 * subtitle = 进度条名称
 * msg = 进度条提示信息名称
 * callback = 回调
 *
 * excel建账、第三方线下建账
 */

const importStatus = ({ subtitle, msg, taskId, success = () => {}, error = () => {} }) => {
  progressModal(subtitle, msg, (modal) => {
    const timer = setInterval(async () => {
      const { status } = await services.getThirdImportStatus({
        taskId,
      });
      if (status === 'doing') {
        // 等待
      } else if (status === 'success') {
        // 成功
        clearInterval(timer);
        modal.hide();

        setTimeout(function() {
          message.success('恭喜你，建账成功');
          success();
        }, 50);
      } else {
        // 失败
        clearInterval(timer);
        modal.hide();
        message.error('建账失败');
        error();
      }
    }, 2000);
  });
};
export default importStatus;
