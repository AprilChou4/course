// 建账 > 新建账套
import React, { Component } from 'react';
import { connect } from 'nuomi';
import { Form, Radio } from 'antd';
import Offline from './Offline';
import Online from './Online';

const FormItem = Form.Item;
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
    const { industryTypeParent } = changedFields;
    if (industryTypeParent) {
      props.form.resetFields(['kjkm']);
    }
    props.dispatch({
      type: 'updateState',
      payload: {
        currRecord: { ...props.currRecord, ...changedFields },
      },
    });
  },
})
class ThirdAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      softwareType: 1,
    };
  }

  changeRadio = (e) => {
    const { value } = e.target;
    this.setState({
      softwareType: value,
    });
  };

  render() {
    const { form } = this.props;
    const { softwareType } = this.state;
    return (
      <Form {...formItemLayout}>
        <FormItem label="&nbsp;" colon={false} {...layout}>
          <Radio.Group onChange={this.changeRadio} value={softwareType}>
            <Radio value={1}>线下财务软件</Radio>
            <Radio value={2}>线上财务软件</Radio>
          </Radio.Group>
        </FormItem>
        {[<Offline form={form} />, <Online form={form} />][softwareType - 1]}
      </Form>
    );
  }
}
export default connect(({ currRecord }) => ({
  currRecord,
}))(ThirdAccount);
