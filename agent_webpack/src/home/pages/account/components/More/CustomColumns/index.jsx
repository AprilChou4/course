import React, { useState } from 'react';
import { connect } from 'nuomi';
import CustomColModal from '../../CustomColModal';
import { storeForUser } from '../../../utils';

const CustomColumn = ({ sorters, dispatch }) => {
  const [visible, setVisible] = useState(false);
  const open = () => {
    setVisible(true);
  };
  const cancel = () => {
    setVisible(false);
  };

  const setColOption = (columnSource) => {
    storeForUser('ACCOUNT_COLUMNS_SOURCE_1', JSON.stringify(columnSource));
    if (columnSource.find((item) => item.type === 'index')) {
      delete sorters.sortByCode;
    }
    cancel();
    dispatch({
      type: 'updateState',
      payload: {
        columnSource,
        sorters,
      },
    });
    dispatch({
      type: 'query',
    });
  };
  return (
    <>
      <div onClick={open}>自定义显示列</div>
      {visible && (
        <CustomColModal onCancel={cancel} setColOption={setColOption} visible={visible} />
      )}
    </>
  );
};

export default connect(({ sorters }) => ({
  sorters,
}))(CustomColumn);
