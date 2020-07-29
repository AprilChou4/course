/**
 * 遍历生成Antd.Select的children
 * @param {string} dataSource 下拉框数据
 * @param {func} getSelectNodeProps 给dataSource传递属性
 */

import React from 'react';
import { Select } from 'antd';
import isNil from './isNil';

const { Option: SelectOption } = Select;

const getSelectOptions = (dataSource, getSelectNodeProps) =>
  dataSource.map((item, index) => {
    const datas = getSelectNodeProps ? { ...item, ...getSelectNodeProps(item, index) } : item;
    const { key, value, name, disabled } = datas;
    return (
      <SelectOption
        key={key || value || index}
        value={value}
        disabled={disabled || isNil(value)}
        title={name}
        dataref={datas}
      >
        {name}
      </SelectOption>
    );
  });

export default getSelectOptions;
