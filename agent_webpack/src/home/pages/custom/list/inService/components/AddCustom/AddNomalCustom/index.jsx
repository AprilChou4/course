// 新增客户>普通新增
import React, { Component } from 'react';
import { connect } from 'nuomi';
import { Form, Row, Col, message, Select, Button } from 'antd';
import { InputLimit } from '@components/InputLimit';
import Title from '@components/Title';
import ShowConfirm from '@components/ShowConfirm';
import Authority from '@components/Authority';
import CustomerNameInput from '../CustomerNameInput';
import CustomerCodeInput from '../CustomerCodeInput';
import ServiceInfo from '../ServiceInfo';
import { dictionary } from '../../../../../utils';
import services from '../../../services';

const FormItem = Form.Item;
const { Option } = Select;
const formItemLayout = {
  labelCol: {
    sm: { span: 8 },
  },
  wrapperCol: {
    sm: { span: 16 },
  },
};

@Form.create()
class AddNomalCustom extends Component {
  /**
   * @param {*boolean} flag true=保存并建账 false=保存
   */
  save = (flag) => {
    const { dispatch } = this.props;
    const {
      form: { validateFields },
    } = this.props;
    validateFields((err, values) => {
      if (!err) {
        const subData = { ...values };
        if (flag && !subData.serviceType.includes(0)) {
          ShowConfirm({
            title: '勾选“代理记账”才能进行建账操作',
            type: 'warning',
            width: 288,
          });
          return false;
        }
        delete subData.serviceType;
        dispatch({
          type: '$addCustomer',
          payload: {
            ...subData,
            flag,
          },
        });
      }
    });
  };

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
    const { form, addCustomerCode, loadings } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form {...formItemLayout}>
        <Title title="客户基础信息" />
        <Row gutter={12}>
          <Col span={12}>
            <CustomerCodeInput form={form} defaultValue={addCustomerCode} />
          </Col>
          <Col span={12}>
            <CustomerNameInput form={form} />
          </Col>
        </Row>
        <Row gutter={12}>
          <Col span={12}>
            <FormItem label="统一社会信用代码">
              {getFieldDecorator('unifiedSocialCreditCode', {
                initialValue: '',
                rules: [
                  {
                    pattern: /^[a-zA-Z0-9]{15,20}$/,
                    message: '格式有误，须为15~20位数字、字母',
                  },
                ],
              })(
                <InputLimit
                  placeholder="请输入统一社会信用代码"
                  maxLength={30}
                  autoComplete="off"
                />,
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="纳税性质">
              {getFieldDecorator('vatType', {
                initialValue: undefined,
              })(
                <Select placeholder="请选择纳税性质">
                  {dictionary.taxType.list.map((item) => (
                    <Option value={item.value} key={item.value}>
                      {item.name}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>
          </Col>
        </Row>
        <ServiceInfo form={form} />
        <div className="f-tac e-mb20">
          <Authority code="10">
            <Button
              className="e-mr20"
              onClick={() => this.save(true)}
              loading={!!loadings.$addCustomer}
            >
              保存并建账
            </Button>
          </Authority>
          <Button type="primary" onClick={() => this.save(false)} loading={!!loadings.$addCustomer}>
            保存
          </Button>
        </div>
      </Form>
    );
  }
}
export default connect(({ loadings, addCustomerCode }) => ({ loadings, addCustomerCode }))(
  AddNomalCustom,
);
