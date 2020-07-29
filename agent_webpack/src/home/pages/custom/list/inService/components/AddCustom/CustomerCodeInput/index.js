// 客户新增>客户编码
import React, { Component } from 'react';
import { Form, message } from 'antd';
import { InputLimit } from '@components/InputLimit';
import services from '../../../services';

const FormItem = Form.Item;

class CustomerCodeInput extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // 验证判断客户编码额是否重复
  fieldCheck = async (rule, value, callback) => {
    try {
      const data = await services.checkCustomerCode({ customerCode: value });
      if (data) {
        callback('客户编码不可重复');
      } else {
        callback();
      }
    } catch (err) {
      message.error(err.message);
    }
  };

  render() {
    const {
      form: { getFieldDecorator },
      defaultValue,
      ...rest
    } = this.props;
    return (
      <FormItem label="客户编码">
        {getFieldDecorator('customerCode', {
          initialValue: defaultValue,
          validateTrigger: ['onBlur'],
          rules: [
            {
              validator: this.fieldCheck,
            },
          ],
        })(<InputLimit placeholder="请输入客户编码" maxLength={30} autoComplete="off" {...rest} />)}
      </FormItem>
    );
  }
}
CustomerCodeInput.defaultProps = {
  // 默认值
  defaultValue: '',
  // 表单验证
  form: {},
};
export default CustomerCodeInput;
