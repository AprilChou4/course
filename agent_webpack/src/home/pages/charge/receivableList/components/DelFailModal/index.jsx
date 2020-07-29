// 删除失败弹窗
import React from 'react';
import { Modal } from 'antd';
import { connect } from 'nuomi';
import CollapseItem from '@components/CollapseItem';
import Style from './style.less';

const DelFailModal = ({ dispatch, delFailVisible, delFailData }) => {
  const { successCount, failedCount, failedReason, failedSrbNos } = delFailData;
  //   获取失败内容
  const getContent = () => {
    return (
      <div className={Style['m-list']}>
        <p>以下应收单已被参照生成收款单，无法删除：</p>
        {failedSrbNos &&
          failedSrbNos.length &&
          failedSrbNos.map((item, index) => <p key={index}>{item}</p>)}
      </div>
    );
  };

  const onOk = () => {
    dispatch({
      type: 'updateCondition',
    });
    dispatch({
      type: 'updateState',
      payload: {
        delFailVisible: false,
        delFailData: {},
      },
    });
  };
  return (
    <Modal
      visible={delFailVisible}
      title="删除结果"
      className={Style['m-delFailModal']}
      cancelButtonProps={{
        style: {
          display: 'none',
        },
      }}
      okText="知道了"
      onCancel={onOk}
      onOk={onOk}
    >
      <h3>
        成功删除{successCount}张应收单,{failedCount}张删除失败
      </h3>
      <CollapseItem getContent={() => getContent()} header="详细原因" />
    </Modal>
  );
};
export default connect(({ delFailVisible, delFailData }) => ({ delFailVisible, delFailData }))(
  DelFailModal,
);
