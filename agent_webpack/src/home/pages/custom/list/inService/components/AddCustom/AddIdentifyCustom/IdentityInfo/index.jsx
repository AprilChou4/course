// 新增客户>识别新增>右侧表单
import React, { Component } from 'react';
import { connect } from 'nuomi';
import { Form, Input, InputNumber, DatePicker } from 'antd';
import moment from 'moment';
import { InputLimit } from '@components/InputLimit';
import CustomerCodeInput from '../../CustomerCodeInput';
import CustomerNameInput from '../../CustomerNameInput';

const FormItem = Form.Item;
class IdentityInfo extends Component {
  componentDidMount() {}

  render() {
    const { form, addCustomerCode, scanSubData } = this.props;
    const { getFieldDecorator } = form;
    const {
      businessScope,
      customerName,
      enclosureName,
      enclosurePath,
      establishmentDate,
      registeredCapital,
      registrationAddress,
      registrationAuthority,
      representative,
      unifiedSocialCreditCode,
    } = scanSubData;
    return (
      <>
        <CustomerCodeInput form={form} defaultValue={addCustomerCode} />
        <CustomerNameInput form={form} defaultValue={customerName} />
        <FormItem label="统一社会信用代码">
          {getFieldDecorator('unifiedSocialCreditCode', {
            initialValue: unifiedSocialCreditCode || '',
            rules: [
              {
                pattern: /^[a-zA-Z0-9]{15,20}$/,
                message: '格式有误，须为15~20位数字、字母',
              },
            ],
          })(<InputLimit placeholder="请输入统一社会信用代码" maxLength={30} autoComplete="off" />)}
        </FormItem>
        <FormItem label="法定代表人">
          {getFieldDecorator('representative', {
            initialValue: representative || '',
          })(<Input placeholder="请输入法定代表人" maxLength={30} autoComplete="off" />)}
        </FormItem>
        <FormItem label="注册资本">
          {getFieldDecorator('registeredCapital', {
            initialValue: registeredCapital || '',
          })(
            <InputNumber
              placeholder="请输入注册资本"
              autoComplete="off"
              style={{ width: '100%' }}
            />,
          )}
        </FormItem>
        <FormItem label="成立日期">
          {getFieldDecorator('establishmentDate', {
            initialValue: establishmentDate ? moment(establishmentDate) : null,
          })(<DatePicker placeholder="请输入成立日期" style={{ width: '100%' }} />)}
        </FormItem>
        <FormItem label="经营场所">
          {getFieldDecorator('registrationAddress', {
            initialValue: registrationAddress || '',
          })(<Input placeholder="请输入经营场所" autoComplete="off" />)}
        </FormItem>
        <FormItem label="经营范围">
          {getFieldDecorator('businessScope', {
            initialValue: businessScope || '',
          })(<Input placeholder="请输入经营范围" autoComplete="off" />)}
        </FormItem>
      </>
    );
  }
}
export default connect(({ addCustomerCode, scanSubData }) => ({
  addCustomerCode,
  scanSubData,
}))(IdentityInfo);
