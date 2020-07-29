import React from 'react';
import { Form } from 'antd';
import { UI_FORM_TABLE } from './utils';

/* eslint-disable react/jsx-props-no-spreading */

// 空白只做展示的表单组件
const Blank = React.forwardRef(({ value, ...rest }, ref) => {
  return (
    <span ref={ref} {...rest}>
      {value}
    </span>
  );
});

const TableCell = (props) => {
  const {
    dataIndex,
    form,
    rowKey,
    record,
    rowIndex,
    render,
    blank,
    asterisk,
    fieldDecorator = {},
    children,
    ...restProps
  } = props;
  if (blank) return <td {...restProps}>{children}</td>;

  // console.log('xxxxx', form.getFieldValue(`${UI_FORM_TABLE}.${record[rowKey]}.${dataIndex}`));
  // console.log('xxxxx', record);

  let Comp = render ? render(record[dataIndex], record, rowIndex, {}) : <Blank />;
  Comp = Comp || <Blank />;
  return (
    <td {...restProps}>
      <Form.Item>
        {form.getFieldDecorator(`${UI_FORM_TABLE}.${record[rowKey]}.${dataIndex}`, {
          initialValue: record[dataIndex],
          ...fieldDecorator,
        })(Comp)}
      </Form.Item>
    </td>
  );
};

export default TableCell;
