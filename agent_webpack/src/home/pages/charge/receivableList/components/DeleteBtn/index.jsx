/**
 * 点击删除
 */
import React from 'react';
import { Button, message } from 'antd';
import { ShowConfirm } from '@components';
import { connect } from 'nuomi';

const DeleteBtn = ({ dispatch, selectedRowKeys }) => {
  // 点击删除
  const del = () => {
    if (!selectedRowKeys.length) {
      message.warning('请选择要删除的信息');
      return false;
    }
    ShowConfirm({
      title: '你确定要删除此应收单吗？',
      onOk: () => {
        dispatch({
          type: '$deleteShouldReceiveBill',
          payload: {
            shouldReceiveIds: selectedRowKeys,
          },
        });
      },
    });
  };
  return (
    <>
      <Button className="e-ml12" onClick={del}>
        删除
      </Button>
    </>
  );
};

export default connect(({ selectedRowKeys }) => ({
  selectedRowKeys,
}))(DeleteBtn);
