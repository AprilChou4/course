import React from 'react';
import { message } from 'antd';
import { InputLimit, TextAreaLimit } from '@components';

const Input = () => {
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
    <div>
      <InputLimit {...inputProps} placeholder="普通input" />
      <InputLimit {...inputProps} allowClear placeholder="带清除icon input" />
      {/* <TextAreaLimit {...inputProps} /> */}
    </div>
  );
};

export default Input;
