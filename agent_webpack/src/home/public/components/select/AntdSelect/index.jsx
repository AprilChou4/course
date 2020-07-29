import React, { forwardRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';
import classnames from 'classnames';
import { getSelectOptions } from '@utils';

/**
 * 在Antd Select的基础上设置一些默认值和样式
 */
const AntdSelect = forwardRef(
  ({ dataSource, getSelectNodeProps, children, className, ...restProps }, ref) => {
    const selectNodes = useMemo(
      () => children || getSelectOptions(dataSource, getSelectNodeProps),
      [children, dataSource, getSelectNodeProps],
    );

    return (
      <Select
        showSearch
        placeholder="请选择"
        optionFilterProp="children"
        filterOption={(input, option) =>
          option.props.children.toLowerCase().includes(input.toLowerCase())
        }
        className={classnames('antd-select', className)}
        {...restProps}
        ref={ref}
      >
        {selectNodes}
      </Select>
    );
  },
);

AntdSelect.propTypes = {
  // 下拉列表数据
  dataSource: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object]),
  ),
  getSelectNodeProps: PropTypes.func, // 给dataSource传递属性
};

AntdSelect.defaultProps = {
  dataSource: [],
  getSelectNodeProps: (data) => data,
};

export default AntdSelect;
