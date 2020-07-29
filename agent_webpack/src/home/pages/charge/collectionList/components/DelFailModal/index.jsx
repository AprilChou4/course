// 删除失败弹窗
import React from 'react';
import { Modal } from 'antd';
import { connect } from 'nuomi';
import CollapseItem from '@components/CollapseItem';
import Style from './style.less';

const DelFailModal = ({ dispatch, delFailVisible, delFailData }) => {
  const { successNum, errorNum, receiptNos } = delFailData;
  //   获取失败内容
  const getContent = () => {
    return (
      <div className={Style['m-list']}>
        <p>以下收款单参照的应收单已完成收款，无法删除：</p>
        {receiptNos &&
          receiptNos.length &&
          receiptNos.map((item, index) => <p key={index}>{item}</p>)}
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
        成功删除{successNum}张收款单,{errorNum}张删除失败
      </h3>
      <CollapseItem getContent={() => getContent()} header="详细原因" />
    </Modal>
  );
};
export default connect(({ delFailVisible, delFailData }) => ({ delFailVisible, delFailData }))(
  DelFailModal,
);
