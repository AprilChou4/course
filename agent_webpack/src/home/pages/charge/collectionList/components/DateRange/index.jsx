import React from 'react';
import { DatePicker } from 'antd';
import moment from 'moment';
import { connect } from 'nuomi';
import { util } from '@utils';

const { RangePicker } = DatePicker;

const style = {
  width: 250,
};
const DateRange = ({ dispatch, tableConditions }) => {
  const { beginCreateBillDate, endCreateBillDate } = tableConditions;
  const startDate = beginCreateBillDate
    ? moment(moment(beginCreateBillDate, 'X').format('YYYY-MM-DD'))
    : null;
  const endDate = endCreateBillDate
    ? moment(moment(endCreateBillDate, 'X').format('YYYY-MM-DD'))
    : null;
  // 改变日期
  const onChange = (date, dateString) => {
    const [start, end] = dateString;
    dispatch({
      type: 'updateCondition',
      payload: {
        beginCreateBillDate: start ? util.formatTime(start, 'startOf', 'X') : null,
        endCreateBillDate: end ? util.formatTime(end, 'endOf', 'X') : null,
      },
    });
  };
  return (
    <span>
      制单日期：
      <RangePicker onChange={onChange} style={style} value={[startDate, endDate]} />
    </span>
  );
};
export default connect(({ tableConditions }) => ({
  tableConditions,
}))(DateRange);
