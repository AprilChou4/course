// 更多 > 导入授权码
import React, { useCallback } from 'react';
import { connect } from 'nuomi';
import AuthCodeModal from './AuthCodeModal';

const ImportCode = ({ dispatch }) => {
  // 导入授权码
  const importClick = useCallback(() => {
    dispatch({
      type: 'updateState',
      payload: {
        authCodeVisible: true,
      },
    });
  }, [dispatch]);

  return (
    <>
      <div onClick={importClick}>导入授权码</div>
      <AuthCodeModal />
    </>
  );
};
export default connect()(ImportCode);
