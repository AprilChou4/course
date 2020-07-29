/**
 * 服务期数
 */

import React, { forwardRef, useCallback } from 'react';
import { NumberInput } from '@components';
import styles from './style.less';

const ServicePeriods = forwardRef(({ value, onChange, style, ...restProps }, ref) => {
  const triggerChange = useCallback(
    (changedValue) => {
      onChange &&
        onChange({
          ...value,
          ...changedValue,
        });
    },
    [onChange, value],
  );

  const handleFirstChange = useCallback(
    (val) => {
      triggerChange({ first: val });
    },
    [triggerChange],
  );

  const handleSecondChange = useCallback(
    (val) => {
      triggerChange({ second: val });
    },
    [triggerChange],
  );

  return (
    <div ref={ref} style={style}>
      <NumberInput
        placeholder="0"
        precision={0}
        {...restProps}
        value={value.first}
        onChange={handleFirstChange}
        className={styles.input}
      />
      <span className={styles.symbol}>+</span>
      <NumberInput
        placeholder="赠送"
        precision={0}
        {...restProps}
        value={value.second}
        onChange={handleSecondChange}
        className={styles.input}
      />
    </div>
  );
});

export default ServicePeriods;
