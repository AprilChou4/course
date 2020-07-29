// 对接税务筹划平台新手引导
import React from 'react';
import {  Modal } from 'antd';
import { connect } from 'nuomi';
import { updateNewTip } from '@utils';
import Style from './style.less';

const TaxGuide = ({ dispatch, taxGuideVisible }) => {
  // 进入引导
  const goTip = () => {
    dispatch({
      type: 'updateState',
      payload: {
        taxSliderVisible: true,
        taxGuideVisible: false,
      },
    });
  };
  //   关闭弹窗
  const close = () => {
    updateNewTip('taxplan_guide');
    dispatch({
      type: 'updateState',
      payload: {
        taxGuideVisible: false,
      },
    });
  };
  return (
    <Modal
      title={null}
      visible={taxGuideVisible}
      maskClosable={false}
      width={460}
      height={260}
      centered
      footer={null}
      className={Style['m-taxGuide']}
      onCancel={close}
    >
      <div className={Style['m-icon']} onClick={goTip}></div>
      <p>
        <a onClick={close}>不，我已熟悉</a>
      </p>
    </Modal>
  );
};
export default connect(({ taxGuideVisible }) => ({
  taxGuideVisible,
}))(TaxGuide);
