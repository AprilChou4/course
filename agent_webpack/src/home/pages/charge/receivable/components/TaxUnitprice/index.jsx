/**
 * 含税单价
 */

import React, { forwardRef, useCallback } from 'react';
import { NumberInput, AntdSelect } from '@components';
import { dictionary } from '../../utils';

const TaxUnitprice = forwardRef(
  ({ value, onChange, style, disabled, disabledInput, disableSelect, ...restProps }, ref) => {
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

    const handleNumberChange = useCallback(
      (val) => {
        triggerChange({ input: val });
      },
      [triggerChange],
    );

    const handleSelectChange = useCallback(
      (select) => {
        triggerChange({ select });
      },
      [triggerChange],
    );

    return (
      <span ref={ref} style={style}>
        <NumberInput
          disabled={disabled || disabledInput}
          placeholder="0.00"
          {...restProps}
          value={value.input}
          onChange={handleNumberChange}
          addonAfter={
            <AntdSelect
              disabled={disabled || disableSelect}
              placeholder=""
              showSearch={false}
              value={value.select}
              dropdownMatchSelectWidth={false}
              dataSource={dictionary.TaxPriceUnit.list}
              onChange={handleSelectChange}
              style={{ minWidth: 49 }}
            />
          }
        />
      </span>
    );
  },
);

export default TaxUnitprice;
