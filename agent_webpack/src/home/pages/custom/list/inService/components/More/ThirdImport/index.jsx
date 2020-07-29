// 更多 > 导入授权码
import React from 'react';
import { connect } from 'nuomi';
import ThirdModal from './ThirdModal';
import ThirdCtrlModal from './ThirdCtrlModal';

const ThirdImport = ({ dispatch, thirdImportVisible, selectCustomVisible }) => {
  const showImport = () => {
    // ctrl是否按住
    const isCtrl = window.event.ctrlKey;
    // const option = isCtrl ? { thirdCtrlVisible: true } : { thirdImportVisible: true };
    const option = { thirdImportVisible: true };
    dispatch({
      type: 'updateState',
      payload: {
        ...option,
      },
    });
  };

  return (
    <>
      <div onClick={showImport}>第三方导入</div>
      {(thirdImportVisible || selectCustomVisible) && <ThirdModal />}
      <ThirdCtrlModal />
    </>
  );
};
export default connect(({ thirdImportVisible, selectCustomVisible }) => ({
  thirdImportVisible,
  selectCustomVisible,
}))(ThirdImport);
