import React, { Component } from 'react';
import { connect } from 'nuomi';
import { Form, Select } from 'antd';
import Title from '@components/Title';
import MultiTreeSelect from '@components/MultiTreeSelect';
import Bookeeper from '../../Bookeeper';
import Collapse from '../Collapse';
import services from '../../../services';
import Style from './style.less';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    sm: { span: 3 },
  },
  wrapperCol: {
    sm: { span: 21 },
  },
};

@Form.create()
class AssignForm extends Component {
  state = {
    bookkeepingAccounting: undefined, // 记账会计
    bookkeepingAccountingName: '', // 原记账会计
    accountingAssistant: [], // 会计助理
    taxReportingAccounting: [], // 报税会计
    drawer: [], // 开票员
    customerConsultant: [], // 客户顾问
  };

  componentDidMount() {
    this.getAssignInfo();
  }

  async getAssignInfo() {
    const { selectedRowKeys } = this.props;
    const {
      bookkeepingAccounting,
      bookkeepingAccountingName,
      accountingAssistant,
      taxReportingAccounting,
      drawer,
      customerConsultant,
    } = await services.getAssignInfo(selectedRowKeys);
    this.setState({
      bookkeepingAccounting,
      bookkeepingAccountingName,
      accountingAssistant,
      taxReportingAccounting,
      drawer,
      customerConsultant,
    });
  }

  // 记账会计是否必填
  isRequiredBookkeep = () => {
    const { selectedRows } = this.props;
    const createdArr = selectedRows.filter((item) => item.isCreate === 1);
    return !!createdArr.length;
  };

  render() {
    const {
      bookkeepingAccounting,
      bookkeepingAccountingName,
      accountingAssistant,
      taxReportingAccounting,
      drawer,
      customerConsultant,
    } = this.state;
    const {
      accountAssistant,
      drawerList,
      customAdviser,
      taxReporter,
      allEmployeeList,
      form: { getFieldDecorator },
    } = this.props;

    return (
      <Form {...formItemLayout}>
        <Title title="客户" />
        <Collapse />
        <Title title="人员指派" />
        <Form.Item
          label="记账会计"
          className={Style['bookkeeper-item']}
          {...formItemLayout}
          extra={<div>(原记账会计：{bookkeepingAccountingName})</div>}
        >
          {getFieldDecorator('bookkeepingAccounting', {
            initialValue: bookkeepingAccounting || undefined,
            rules: [
              {
                required: this.isRequiredBookkeep(),
                message: '请选择记账会计',
              },
            ],
          })(<Bookeeper />)}
        </Form.Item>
        <FormItem label="会计助理">
          {getFieldDecorator('accountingAssistant', {
            initialValue: accountingAssistant,
          })(
            <MultiTreeSelect
              treeData={accountAssistant}
              allEmployeeList={allEmployeeList}
              searchPlaceholder="输入有“记账平台”权限的员工"
            />,
          )}
        </FormItem>
        <FormItem label="报税会计">
          {getFieldDecorator('taxReportingAccounting', {
            initialValue: taxReportingAccounting,
          })(
            <MultiTreeSelect
              treeData={taxReporter}
              allEmployeeList={allEmployeeList}
              searchPlaceholder="输入有“报税平台”权限的员工"
            />,
          )}
        </FormItem>
        <FormItem label="开票员">
          {getFieldDecorator('drawer', {
            initialValue: drawer,
          })(
            <MultiTreeSelect
              treeData={drawerList}
              allEmployeeList={allEmployeeList}
              searchPlaceholder="输入有“代开平台”权限的员工"
            />,
          )}
        </FormItem>
        <FormItem label="客户顾问">
          {getFieldDecorator('customerConsultant', {
            initialValue: customerConsultant,
          })(
            <MultiTreeSelect
              treeData={customAdviser}
              allEmployeeList={allEmployeeList}
              searchPlaceholder="输入有“客户管理”权限的员工"
            />,
          )}
        </FormItem>
      </Form>
    );
  }
}
export default connect(
  ({
    selectedRows,
    selectedRowKeys,
    accountAssistant,
    drawerList,
    customAdviser,
    taxReporter,
    allEmployeeList,
  }) => ({
    selectedRows,
    selectedRowKeys,
    accountAssistant,
    drawerList,
    customAdviser,
    taxReporter,
    allEmployeeList,
  }),
)(AssignForm);
