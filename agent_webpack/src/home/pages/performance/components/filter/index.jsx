import React, { useCallback } from 'react';
import { connect } from 'nuomi';
import { Select, Button } from 'antd';
import { pick } from 'lodash';
import { Calendar, DeptTreeSelect } from '@components';
import moment from 'moment'; // eslint-disable-line

import './style.less';

const { Option } = Select;

const TableFilter = ({ period, deptId, order, dispatch }) => {
  // 根据字段名生成对应dispatch函数
  const getDispatchFn = (key) => {
    return function handleChange(value) {
      dispatch({
        type: 'updateCondition',
        payload: {
          [key]: value,
        },
      });
    };
  };

  // 月份改变
  const handleMonthChange = getDispatchFn('period');

  // 排序改变
  const handleSortChange = getDispatchFn('order');

  // 部门改变
  const handleDepChange = getDispatchFn('deptId');

  const handleExport = useCallback(() => {
    dispatch({
      type: 'exportExcel',
    });
  }, [dispatch]);

  return (
    <div styleName="staff-performance-filter">
      <div styleName="performance-filter-form-item">
        <Calendar
          value={moment(period)}
          onChange={handleMonthChange}
          getCalendarContainer={(triggerNode) => triggerNode.parentNode}
        />
      </div>
      <div styleName="performance-filter-form-item">
        部门：
        <DeptTreeSelect
          value={deptId}
          onChange={handleDepChange}
          dropdownMatchSelectWidth={false}
          dropdownStyle={{ width: '100%', maxWidth: 300, maxHeight: 300 }}
          getPopupContainer={(triggerNode) => triggerNode.parentNode}
        />
      </div>
      <div styleName="performance-filter-form-item">
        排序：
        <Select value={order} onChange={handleSortChange}>
          <Option value={1}>按工作量</Option>
          <Option value={2}>按客户数</Option>
          <Option value={3}>收款金额</Option>
        </Select>
      </div>
      <Button styleName="export-btn" onClick={handleExport}>
        导出
      </Button>
    </div>
  );
};

export default connect(({ tableConditions }) =>
  pick(tableConditions, ['period', 'deptId', 'order']),
)(TableFilter);
