/* eslint-disable no-nested-ternary */
import { DatePicker, Button } from 'antd';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import moment from 'moment';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import Iconfont from '../Iconfont';
import './style.less';

const { MonthPicker } = DatePicker;

const Calendar = ({
  min,
  max,
  scope,
  onChange,
  format,
  allowClear,
  className,
  dropdownClassName,
  value: propsValue,
  disabledDate: propsDisabledDate,
  ...rest
}) => {
  const [value, setValue] = useState(propsValue);
  const style = useMemo(() => {
    const width = scope > 0 ? 160 : 100;
    return { width };
  }, [scope]);

  useEffect(() => {
    setValue(propsValue);
  }, [propsValue]);

  const getEnddate = (val) => {
    if (scope > 0) {
      return moment(val)
        .add(scope, 'months')
        .format(format);
    }
    return '';
  };

  const change = (val) => {
    setValue(val);
    onChange(val, getEnddate(val));
  };

  const handleChange = (date, dateString) => {
    change(dateString);
  };
  const getValue = (number) =>
    moment(value)
      .add(number, 'months')
      .format(format);
  const handlePrev = () => change(getValue(-1));
  const handleNext = () => change(getValue(1));

  const enddate = getEnddate(value);

  const disabledDate = useCallback(
    (currentDate) => {
      if (min || max) {
        if (min && !max) {
          return currentDate.isBefore(moment(min));
        }
        if (!min && max) {
          return currentDate.isAfter(
            scope > 0 ? moment(max).subtract(scope, 'months') : moment(max),
          );
        }

        return (
          currentDate.isBefore(moment(min)) ||
          currentDate.isAfter(scope > 0 ? moment(max).subtract(scope, 'months') : moment(max))
        );
      }
      if (propsDisabledDate) {
        return propsDisabledDate(currentDate);
      }
      return false;
    },
    [max, min, propsDisabledDate, scope],
  );

  return (
    <span
      className={classnames('ui-ant-calendar', className)}
      enddate={value ? (enddate ? `至${enddate}` : enddate) : ''}
    >
      <Button onClick={handlePrev} disabled={min === value}>
        <Iconfont code="&#xe6d9;" />
      </Button>
      <MonthPicker
        style={style}
        {...rest}
        disabledDate={disabledDate}
        allowClear={allowClear}
        value={value ? moment(value) : undefined}
        dropdownClassName={classnames('ui-ant-calendar-picker', dropdownClassName)}
        onChange={handleChange}
      />
      <Button onClick={handleNext} disabled={scope > 0 ? enddate === max : max === value}>
        <Iconfont code="&#xe611;" />
      </Button>
    </span>
  );
};

Calendar.defaultProps = {
  /**
   * @func 值大于0时开启展示月份范围，值为11展示1年的区间
   */
  scope: 0,
  format: 'YYYY-MM',
  allowClear: false,
  onChange() {},
};

Calendar.propTypes = {
  scope: PropTypes.number,
  format: PropTypes.string,
  allowClear: PropTypes.bool,
  onChange: PropTypes.func,
};

export default Calendar;
