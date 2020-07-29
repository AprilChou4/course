/**
 * 金额输入框
 */
import React, { forwardRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { isNil } from '@utils';
import AntdInput from '../AntdInput';

const NumberInput = forwardRef(
  ({ value, precision, maxLength, max, onMax, onChange, onBlur, ...restProps }, ref) => {
    const handleChange = useCallback(
      (e) => {
        const { value: val } = e.target;
        // const reg = /^(0|[1-9][0-9]{0,8})(\.[0-9]{0,2})?$/;
        const reg = new RegExp(
          `^(0|[1-9][0-9]${maxLength ? `{0,${maxLength - 1}}` : `*`})(${
            precision > 0 ? `\\.` : ''
          }\\d{0,${precision}})?$`,
        );

        if ((!Number.isNaN(val) && reg.test(val)) || val === '') {
          if (!isNil(max) && Number(val) > max) {
            // message.warning(`不能超过最大值${max}`);
            onMax && onMax(value, e);
            return;
          }
          onChange && onChange(val, e);
        }
      },
      [max, maxLength, onChange, onMax, precision, value],
    );

    const handleBlur = useCallback(
      (e) => {
        const val = value ? `${value}` : '';
        if ((val && val.charAt(val.length - 1)) === '.') {
          onChange && onChange(val.slice(0, -1), e);
        }
        onBlur && onBlur(e);
      },
      [onBlur, onChange, value],
    );

    return (
      <AntdInput
        {...restProps}
        ref={ref}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
      />
    );
  },
);

NumberInput.propTypes = {
  precision: PropTypes.number, // 数值精度（小数点位数）
  max: PropTypes.number, // 最大值
  maxLength: PropTypes.number, // 最大长度
  onMax: PropTypes.func, // 超过值后的回调
};

NumberInput.defaultProps = {
  precision: 2,
  maxLength: 9,
  onMax() {},
};

export default NumberInput;
