// 客户管理 > 更多 > 自定义列
import React, { useState, useCallback } from 'react';
import { connect } from 'nuomi';
import CustomColModal from '@components/CustomColModal';

const CustomColumn = ({ columnSource = [], loadings, dispatch }) => {
  const [visible, setVisible] = useState(false); // 自定义弹窗是否显示

  // 点击自定义列
  const open = () => {
    setVisible(true);
  };

  // 取消/关闭自定义列弹窗
  const cancel = useCallback(() => {
    setVisible(false);
  }, []);

  // 保存自定义顺序列
  const setColOption = useCallback(
    (columnSourceArr) => {
      dispatch({
        type: '$updateHeaderColumn',
        payload: {
          customerHeaderRequestList: columnSourceArr,
        },
      }).then(() => {
        cancel();
      });
    },
    [cancel, dispatch],
  );

  return (
    <>
      <div onClick={open}>自定义显示列</div>
      {visible && (
        <CustomColModal
          columnSource={columnSource}
          onCancel={cancel}
          visible={visible}
          isLoading={loadings.$updateHeaderColumn}
          setColOption={setColOption}
        />
      )}
    </>
  );
};

export default connect(({ columnSource, loadings }) => ({ columnSource, loadings }))(CustomColumn);
