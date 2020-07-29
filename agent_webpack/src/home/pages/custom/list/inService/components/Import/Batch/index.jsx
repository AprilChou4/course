// 新增客户 > 批量导入
import React, { useCallback } from 'react';
import { connect } from 'nuomi';
import BatchModal from './BatchModal';

const BatchImport = ({ batchVisible, dispatch }) => {
  // 点击批量导入
  const batch = useCallback(() => {
    dispatch({
      type: 'updateState',
      payload: {
        batchVisible: true,
      },
    });
  }, [dispatch]);

  return (
    <>
      <div onClick={batch}>批量导入</div>
      {batchVisible && <BatchModal />}
    </>
  );
};
export default connect(({ batchVisible }) => ({ batchVisible }))(BatchImport);
