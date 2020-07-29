import React from 'react';
import { DatePicker } from 'antd';
import { connect } from 'nuomi';
import { util } from '@utils';

const { RangePicker } = DatePicker;

const style = {
  width: 250,
};

const DateRange = ({ dispatch }) => {
  // 改变日期
  const onChange = (date, dateString) => {
    const [start, end] = dateString;
    dispatch({
      type: 'updateCondition',
      payload: {
        createBillDateMin: util.formatTime(start, 'startOf', 'X'),
        createBillDateMax: util.formatTime(end, 'endOf', 'X'),
      },
    });
  };
  return (
    <span>
      制单日期：
      <RangePicker onChange={onChange} style={style} />
    </span>
  );
};
export default connect()(DateRange);
