// 建账 > 其他方式
import React, { Component } from 'react';
import { connect } from 'nuomi';
import { request } from 'nuijs';
import axios from 'axios';
import { Form, Input, Button, message, Select } from 'antd';
import { progressModal } from '@components/HintModal';
import Style from './style.less';

const FormItem = Form.Item;
const { Option } = Select;
const formItemLayout = {
  labelCol: {
    sm: { span: 4 },
  },
  wrapperCol: {
    sm: { span: 20 },
  },
};
@Form.create()
class NewAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchVal: '',
      copyedAccountList: [],
    };
  }

  componentDidMount = async () => {
    const { dispatch } = this.props;
    dispatch({
      type: '$getListAccount',
    }).then((res) => {
      this.setState({
        copyedAccountList: res,
      });
    });
  };

  // 开始建账
  save = () => {
    const {
      form: { validateFields },
      dispatch,
      currRecord: { customerId },
    } = this.props;
    validateFields((err, values) => {
      // const subData = { ...values };
      if (err) return false;
      dispatch({
        type: '$copyAccount',
        payload: {
          customerId,
          accountId: values.accountId,
        },
      });
      // request.post(
      //   'instead/v2/customer/account/copy.do',
      //   {
      //     customerId,
      //     accId: values.accId,
      //   },
      //   (res) => {
      //     if (res.result === 'success') {
      //       progressModal('正在复制账套', '当前复制进度为', (modal) => {
      //         request.get(
      //           'instead/customer/copyProcess.do',
      //           { accId: subData.accId },
      //           (response) => {
      //             if (response.result === 'success') {
      //               const { status } = response.data;
      //               if (status === 'doing') {
      //                 // 等待
      //               } else if (status === 'success') {
      //                 // 成功
      //                 dispatch({
      //                   type: 'updateState',
      //                   payload: {
      //                     accountVisible: false,
      //                   },
      //                 });
      //                 modal.hide();
      //               } else {
      //                 message.error(response.message);
      //                 modal.hide();
      //               }
      //             } else {
      //               message.error(response.message);
      //             }
      //           },
      //         );
      //       });
      //     } else {
      //       message.error(res.message);
      //     }
      //   },
      //   '正在保存..',
      // );
    });
  };

  onSearch = (val) => {
    this.setState({
      searchVal: val,
    });
  };

  onChange = (value, option) => {
    const {
      form: { setFieldsValue },
    } = this.props;
    setFieldsValue({ accountId: value });
  };

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { searchVal, copyedAccountList } = this.state;
    return (
      <Form {...formItemLayout} className={Style['m-otherForm']}>
        <h3>复制已建账账套</h3>
        {getFieldDecorator('accountId', {
          initialValue: '',
        })(<Input type="hidden" />)}
        <FormItem label="已建账账套名称" {...formItemLayout}>
          {getFieldDecorator('ztmc', {
            initialValue: undefined,
            rules: [
              {
                required: true,
                message: '请选择已建账账套名称',
              },
            ],
          })(
            <Select
              showSearch
              placeholder="请输入账套名称搜索"
              optionFilterProp="children"
              onChange={this.onChange}
              // onFocus={onFocus}
              // onBlur={onBlur}
              // onSearch={onSearch}
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {copyedAccountList &&
                copyedAccountList.map((item) => (
                  <Option key={item.accountId} value={item.accountId}>
                    {item.accountName}
                  </Option>
                ))}
            </Select>,
          )}
        </FormItem>
        <FormItem label="&nbsp;" colon={false} {...formItemLayout} className={Style['m-state']}>
          温馨提示：除账套财务数据外，企业税号、账套指派的员工、报税类型、会计制度、建账期间会从选择的账套进行复制
        </FormItem>
        <div className="f-tac">
          <Button type="primary" onClick={this.save}>
            开始建账
          </Button>
        </div>
      </Form>
    );
  }
}
export default connect(({ currRecord }) => ({ currRecord }))(NewAccount);
