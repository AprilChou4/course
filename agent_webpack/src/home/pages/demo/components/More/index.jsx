import React from 'react';
import { message, Button } from 'antd';
import DropDown from '@components/DropDown';
import ExportCustom from './ExportCustom';

const style = {
  marginLeft: 12,
};
const More = () => {
  const inputStyle = { width: 200, marginLeft: 20 };
  const inputProps = {
    maxLength: 10,
    style: inputStyle,
    // preventInput: false,
    onLimit(value, maxLength, e) {
      const { maxlength } = e.target;
      message.warning(`超出最大字数${maxLength}`);
    },
  };

  return (
    <>
      <DropDown style={style}>
        <ExportCustom />
      </DropDown>
      <DropDown style={style}>
        <ExportCustom />
        <ExportCustom />
      </DropDown>
    </>
  );
};

export default More;
