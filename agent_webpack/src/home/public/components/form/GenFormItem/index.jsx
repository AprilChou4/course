import React from 'react';
import PropTypes from 'prop-types';
import { Form, Input } from 'antd';

const { Item: FormItem } = Form;

const GenFormItem = ({
  form: { getFieldDecorator },
  label,
  className,
  name,
  disabled,
  children,
  required,
  ...restProps
}) => (
  <FormItem label={label} className={className} required={required}>
    {getFieldDecorator(
      name,
      restProps,
    )(children || <Input disabled={disabled} placeholder={`请输入${label}`} />)}
  </FormItem>
);

GenFormItem.propTypes = {
  name: PropTypes.string.isRequired, // 输入控件唯一标志
};

GenFormItem.defaultProps = {};

export default GenFormItem;
