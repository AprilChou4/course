import React from 'react';
import { connect } from 'nuomi';

const RecycleBin = ({ dispatch }) => {
  const handleClick = () => {
    dispatch({
      type: 'accountRecycleBin/updateState',
      payload: {
        visible: true,
      },
    });
  };
  return <div onClick={handleClick}>回收站</div>;
};

export default connect()(RecycleBin);
