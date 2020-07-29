// 更多 > 停止服务
import React, { useCallback } from 'react';
import { message } from 'antd';
import { connect } from 'nuomi';
import StopModal from './StopModal';

const StopService = ({ dispatch, stopVisible, selectedRowKeys }) => {
  // 停止服务
  const stop = useCallback(() => {
    if (!selectedRowKeys.length) {
      message.warning('请先选择要停用的客户');
      return false;
    }
    dispatch({
      type: 'updateState',
      payload: {
        stopVisible: true,
      },
    });
  }, [dispatch, selectedRowKeys]);
  return (
    <>
      <div onClick={stop}>停止服务</div>
      {stopVisible && <StopModal />}
    </>
  );
};

export default connect(({ selectedRowKeys, stopVisible }) => ({ selectedRowKeys, stopVisible }))(
  StopService,
);
