import React, { useEffect } from 'react';
import { connect } from 'nuomi';
import Calendar from '@components/Calendar';

const DateMonth = ({ startDate, maxDate, minDate, dispatch }) => {
  const handleChange = (date) => {
    // FIXME: 待优化
    dispatch({
      type: 'updateState',
      payload: {
        startDate: date,
      },
    });
    dispatch({
      type: 'updateMainDatas',
      payload: true,
    });
  };

  // useEffect(() => {
  //   $.when(
  //     request.get('instead/customer/getStatementList', {}, null),
  //     request.get('instead/customer/getBookkeeper', {}, null),
  //   ).done((dateData, operatorData, creatorData) => {
  //     const operators = operatorData[0].data;
  //     const creators = creatorData[0].data.list;
  //     const operatorMap = {};
  //     const creatorMap = {};
  //     operators.forEach((ele) => {
  //       operatorMap[ele.userId] = ele.realName;
  //     });
  //     creators.forEach((ele) => {
  //       creatorMap[ele.userId] = ele.realName;
  //     });

  //     // FIXME:
  //     dispatch({
  //       type: 'updateState',
  //       payload: {
  //         operators,
  //         creators,
  //         operatorMap,
  //         creatorMap,
  //       },
  //     });
  //     dispatch({
  //       type: 'setQuery',
  //     });
  //     dispatch({
  //       type: 'query',
  //       payload: true,
  //     });
  //     dispatch({
  //       type: 'getAccountStatistics',
  //     });
  //   });
  // }, [dispatch]);

  return <Calendar onChange={handleChange} value={startDate} max={maxDate} min={minDate} />;
};

export default connect(({ startDate, maxDate, minDate }) => ({
  startDate,
  maxDate,
  minDate,
}))(DateMonth);
