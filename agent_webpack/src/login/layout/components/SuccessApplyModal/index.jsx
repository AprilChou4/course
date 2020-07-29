// 申请成功提示弹窗
import React from 'react';
import { Modal } from 'antd';
import Style from './style.less';

const SuccessApplyModal = ({ title = '加入公司', onCancel, visible, companyName, ...rest }) => {
  // 关闭弹窗
  const closeModal = () => {
    onCancel();
  };

  return (
    <Modal
      width={490}
      visible={visible}
      className={Style['m-successApplyModal']}
      footer={null}
      centered
      onCancel={closeModal}
      {...rest}
    >
      <div className={Style['m-title']}>{title}</div>
      <div className={Style['m-successHint']}>
        <i className="iconfont">&#xec94;</i>
        <span>提交成功</span>
      </div>
      <div className={Style['m-tip']}>
        <h3>您加入【{companyName}】的申请已成功发送</h3>
        <div>审核结果会以短信形式通知您，如需尽快加入请直接请联系公司管理员</div>
      </div>
    </Modal>
  );
};
export default SuccessApplyModal;
