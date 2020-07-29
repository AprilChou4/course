// 对接税务筹划平台新手引导 >关闭提示弹窗
import React from 'react';
import { Modal } from 'antd';
import { connect } from 'nuomi';
import { updateNewTip } from '@utils';
import Style from './style.less';

const TaxCloseTip = ({ dispatch, taxCloseTipVisible }) => {
  //   关闭弹窗
  const close = () => {
    updateNewTip('taxplan_guide');
    dispatch({
      type: 'updateState',
      payload: {
        taxCloseTipVisible: false,
      },
    });
  };
  return (
    <Modal
      title="温馨提示"
      visible={taxCloseTipVisible}
      maskClosable={false}
      width={418}
      height={200}
      centered
      className={Style['m-taxCloseTip']}
      onOk={close}
      okText="知道了"
      cancelButtonProps={{ style: { display: 'none' } }}
      onCancel={close}
    >
      <h3>是否确定退出新版本引导？</h3>
      <p className="f-clearfix">
        <span className="f-fl">可点击客户档案中</span>
        <i className="iconfont f-fl">&#xed9c;</i>
        <span className="f-fl">图标重新查看</span>
      </p>
    </Modal>
  );
};
export default connect(({ taxCloseTipVisible }) => ({
  taxCloseTipVisible,
}))(TaxCloseTip);
