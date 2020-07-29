// 派工按钮
import React from 'react';
import { Button, message } from 'antd';
import { connect } from 'nuomi';
import Authority from '@components/Authority';
import AssignModal from './AssignModal';

const AssignBtn = ({ dispatch, selectedRowKeys, importProgressVisible, assignVisible }) => {
  // 指派
  const assign = () => {
    if (!selectedRowKeys.length) {
      message.warning('请选择指派的客户');
      return false;
    }
    dispatch({
      type: 'updateState',
      payload: {
        assignVisible: true,
      },
    });
  };

  const isDisabled = importProgressVisible ? { disabled: true } : {};
  return (
    <Authority code="8">
      <Button type="primary" onClick={assign} {...isDisabled}>
        派工
      </Button>
      {assignVisible && <AssignModal />}
    </Authority>
  );
};
export default connect(({ assignVisible, selectedRowKeys, importProgressVisible }) => ({
  assignVisible,
  selectedRowKeys,
  importProgressVisible,
}))(AssignBtn);
