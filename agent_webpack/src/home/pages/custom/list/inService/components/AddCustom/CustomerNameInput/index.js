// 客户新增>客户名称
import React, { Component } from 'react';
import { Form, AutoComplete, message } from 'antd';
import { InputLimit } from '@components/InputLimit';
import services from '../../../services';
import Style from './style.less';

const FormItem = Form.Item;
const AutoOption = AutoComplete.Option;
class CustomerNameInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      customerNameList: [], // 用户名列表
    };
  }

  // 用户名选择
  userSelect = (value, option) => {
    const {
      userdata: { unifiedSocialCreditCode },
    } = option.props;
    const {
      form: { setFieldsValue },
      costomCodeName,
    } = this.props;
    const data = {};
    data[costomCodeName] = unifiedSocialCreditCode;
    setFieldsValue(data);
  };

  // 用户名输入查询
  handleSearch = async (value) => {
    try {
      if (!value) {
        return false;
      }
      const data = await services.searchCustomerByName({
        customerName: value,
      });
      const options =
        data &&
        data.map((item, index) => (
          <AutoOption key={index} userdata={item} value={item.customerName}>
            {item.customerName}
          </AutoOption>
        ));
      this.setState({
        customerNameList: options,
      });
    } catch (err) {}
  };

  // 验证判断名字是否重复
  fieldCheck = async (rule, value, callback) => {
    try {
      if (!value) {
        return false;
      }
      const data = await services.checkCustomerName({ customerName: value });
      if (data) {
        callback('客户名称不可重复');
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
    const { customerNameList } = this.state;
    return (
      <FormItem label="客户名称">
        {getFieldDecorator('customerName', {
          initialValue: defaultValue,
          validateTrigger: ['onBlur'],
          rules: [
            {
              whitespace: true,
              message: '请输入非空格字符',
            },
            {
              required: true,
              message: '请输入客户名称',
            },
            {
              max: 40,
              message: '客户名称不能超出40个字符',
            },
            {
              validator: this.fieldCheck,
            },
          ],
        })(
          <AutoComplete
            dataSource={customerNameList}
            onSelect={this.userSelect}
            onSearch={this.handleSearch}
            {...rest}
          >
            <InputLimit
              placeholder="请输入客户名称"
              maxLength={40}
              className={Style['m-limitInput']}
            />
          </AutoComplete>,
        )}
      </FormItem>
    );
  }
}
CustomerNameInput.defaultProps = {
  // 默认值
  defaultValue: '',
  // 社会信用代码字段名称
  costomCodeName: 'unifiedSocialCreditCode',
  // 表单验证
  form: {},
};
export default CustomerNameInput;
