/**
 * 显示长度的输入框
 */
import React, { forwardRef, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import useComponentSize from '@rehooks/component-size';
import { get, mergeRefs } from '@utils';
import If from '../../If';
import AntdInput from '../AntdInput';
import './style.less';

const LimitInput = forwardRef(
  (
    {
      suffix,
      maxLength,
      preventExceeding,
      autoShowError,
      onMax,
      onChange,
      className,
      ...restProps
    },
    ref,
  ) => {
    const [value, setValue] = useState('');
    const inputRef = useRef(null);
    const suffixRef = useRef(null);
    const suffixSize = useComponentSize(suffixRef);

    const calcSuffix = useMemo(() => {
      return (
        <If condition={maxLength}>
          <span ref={suffixRef} className="antd-input-limit-calcSuffix">
            <span className="antd-input-limit-calcSuffix-count">
              {value ? value.length : 0}/{maxLength}
            </span>
            {suffix}
          </span>
        </If>
      );
    }, [maxLength, suffix, suffixRef, value]);

    const handleChange = useCallback(
      (e) => {
        const val = e.target.value;
        if (preventExceeding && val.length > maxLength) {
          onMax && onMax(e);
        }
        setValue(val);
        onChange && onChange(e);
      },
      [maxLength, onChange, onMax, preventExceeding],
    );

    useEffect(() => {
      setValue(restProps.value);
    }, [restProps.value]);

    // 在sufcix长度改变后动态设置input的padding
    useEffect(() => {
      const inputDOM = get(inputRef, 'current.input');
      const calcPaddingRight = suffixSize.width + 12 + 12 + 6;
      inputDOM.style.paddingRight = `${calcPaddingRight}px`; // 只用数字不会生效
    }, [suffixSize.width]);

    return (
      <AntdInput
        ref={mergeRefs(ref, inputRef)}
        {...restProps}
        suffix={calcSuffix}
        onChange={handleChange}
        maxLength={preventExceeding ? maxLength : undefined}
        className={classnames('antd-input-limit', className, {
          [`antd-input-limit-error`]: autoShowError && value && value.length > maxLength,
        })}
      />
    );
  },
);

LimitInput.propTypes = {
  maxLength: PropTypes.number, // 最大长度
  preventExceeding: PropTypes.bool, // 超过最大长度是否阻止输入
  autoShowError: PropTypes.bool, // 超出长度自动变红
  onMax: PropTypes.func, // 超过最大长度后的回调
};

LimitInput.defaultProps = {
  maxLength: 0,
  autoShowError: true,
  preventExceeding: true,
  onMax() {},
};

export default LimitInput;
