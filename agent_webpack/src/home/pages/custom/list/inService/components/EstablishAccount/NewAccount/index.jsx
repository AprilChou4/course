// 建账 > 新建账套
import React, { Component } from 'react';
import { connect } from 'nuomi';
import { Form, Row, Col, Popover, Button, Input, Select, DatePicker } from 'antd';
import { dictionary, judgeVatType } from '@pages/custom/utils';
import { parentIndustry } from '@utils/industry';

import moment from 'moment';
import Bookeeper from '../../Bookeeper';
import SubjectTemplate from '../SubjectTemplate';
import Style from './style';

const { MonthPicker } = DatePicker;
const FormItem = Form.Item;
const { Option } = Select;
const formItemLayout = {
  labelCol: {
    sm: { span: 6 },
  },
  wrapperCol: {
    sm: { span: 18 },
  },
};
const layout = {
  labelCol: {
    sm: { span: 3 },
  },
  wrapperCol: {
    sm: { span: 21 },
  },
};
@Form.create({
  onValuesChange(props, changedFields) {
    const { vatType, industryTypeParent } = changedFields;
    if (industryTypeParent) {
      props.form.resetFields(['kjkm']);
    }
    // if (vatType || vatType === 0) {
    props.dispatch({
      type: 'updateState',
      payload: {
        currRecord: { ...props.currRecord, ...changedFields },
      },
    });
    // }
  },
})
class NewAccount extends Component {
  // 保存
  save = () => {
    const {
      dispatch,
      form: { validateFields },
    } = this.props;
    validateFields((err, values) => {
      if (!err) {
        const subData = { ...values };
        subData.createTime = moment(subData.createTime).format('YYYY-MM');

        dispatch({
          type: '$createNewAccount',
          payload: {
            ...subData,
          },
        });
      }
    });
  };

  // 取消
  cancel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'updateState',
      payload: {
        accountVisible: false,
      },
    });
  };

  render() {
    const {
      form,
      currRecord: { bookkeepingAccounting, customerName, customerId, vatType, industryTypeParent },
    } = this.props;
    const { getFieldDecorator } = form;

    const { isVatType, kjkmInitValue } = judgeVatType(vatType, industryTypeParent, form);

    return (
      <Form {...formItemLayout} className={Style['m-newAccount']}>
        {getFieldDecorator('customerId', {
          initialValue: customerId,
        })(<Input type="hidden" />)}
        <FormItem label="账套名称" {...layout}>
          {getFieldDecorator('accountName', {
            initialValue: customerName || '',
            rules: [
              {
                required: true,
                message: '请输入账套名称',
              },
            ],
          })(<Input placeholder="请输入账套名称" maxLength={30} autoComplete="off" />)}
        </FormItem>
        <Row gutter={12}>
          <Col span={12}>
            <FormItem label="纳税性质">
              {getFieldDecorator('vatType', {
                initialValue: isVatType ? vatType : 1,
                rules: [
                  {
                    required: true,
                    message: '请选择纳税性质',
                  },
                ],
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
          <Col span={12}>
            <FormItem label="行业类型">
              {getFieldDecorator('industryTypeParent', {
                initialValue: industryTypeParent || undefined,
              })(
                <Select
                  placeholder="请选择行业类型"
                  allowClear
                  showSearch
                  filterOption={(inputValue, option) => {
                    return option.props.value.indexOf(inputValue) > -1;
                  }}
                >
                  {parentIndustry.map((item) => (
                    <Option value={item} key={item}>
                      {item}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>
          </Col>
        </Row>
        <FormItem
          label={
            <span>
              会计科目
              <Popover
                placement="bottomLeft"
                content="由管理员、主管会计在“记账设置-科目模板”中维护"
                title={null}
              >
                <a className="iconfont">&#xeb10;</a>
              </Popover>
            </span>
          }
          {...layout}
        >
          {getFieldDecorator('kjkm', {
            // 系统预置和客户自定的value不一样
            initialValue: kjkmInitValue,
            rules: [
              {
                required: true,
                message: '请选择会计科目',
              },
            ],
          })(
            <SubjectTemplate
              type="1"
              form={form}
              vatType={isVatType ? vatType : 1}
              industryTypeParent={industryTypeParent}
              accounting="accounting" // 会计科目值对应名称
              subjectTemplateName="subjectTemplateName" // 会计科目id
              subjectTemplateId="subjectTemplateId" // 会计科目id
            />,
          )}
        </FormItem>
        <Row gutter={12}>
          <Col span={12}>
            <FormItem label="建账时间：">
              {getFieldDecorator('createTime', {
                initialValue: moment(),
              })(
                <MonthPicker
                  placeholder="请选择建账时间"
                  style={{ width: '100%' }}
                  allowClear={false}
                />,
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <Form.Item label="记账会计">
              {getFieldDecorator('bookkeepingAccounting', {
                initialValue: bookkeepingAccounting || undefined,
                rules: [
                  {
                    required: true,
                    message: '请选择记账会计',
                  },
                ],
              })(<Bookeeper />)}
            </Form.Item>
          </Col>
        </Row>
        <div className="f-tac">
          <Button onClick={this.cancel} className="e-mr12">
            取消
          </Button>
          <Button type="primary" onClick={this.save}>
            保存
          </Button>
        </div>
      </Form>
    );
  }
}
export default connect(({ currRecord }) => ({ currRecord }))(NewAccount);
