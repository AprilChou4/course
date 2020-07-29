import React from 'react';
import { DatePicker } from 'antd';
import { util } from '@utils';
import { connect } from 'nuomi';

const { RangePicker } = DatePicker;

const style = {
  width: 250,
};

const DateRange = ({ dispatch, tableType }) => {
  // 改变日期
  const onChange = (date, dateString) => {
    const [start, end] = dateString;
    const url = tableType ? '$getCollectPlanList' : '$getCollectPlanDetailList';
    dispatch({
      type: url,
      payload: {
        shouldReceiveDateMin: util.formatTime(start, 'startOf', 'X'),
        shouldReceiveDateMax: util.formatTime(end, 'endOf', 'X'),
      },
    });
  };
  return (
    <span>
      期间：
      <RangePicker onChange={onChange} style={style} />
    </span>
  );
};
export default connect(({ tableType }) => ({
  tableType,
}))(DateRange);
