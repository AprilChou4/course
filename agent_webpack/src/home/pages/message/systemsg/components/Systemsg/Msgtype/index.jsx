// 系统消息>消息类别下拉框
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'nuomi';
import { Form, Select } from 'antd';

const { Option } = Select;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    sm: { span: 8 },
  },
  wrapperCol: {
    sm: { span: 16 },
  },
};

// 消息类型 0-系统消息 1-辅助核算提醒 2-固定资产提醒 3-外币核算提醒 4-待接收帐套提醒 5-帐套交接更新提醒 6-工作提醒（云代账到期提醒） 7-合同到期提醒 8-合同欠款提醒 9-派工消息 10-建议反馈消息提醒 11-客户跟进系统消息.
const typeList = [
  {
    title: '全部',
    value: '',
  },
  {
    title: '系统消息 ',
    value: '0',
  },
  {
    title: '账套交接提醒',
    value: '4',
  },
  {
    title: '客户合同/收费提醒',
    value: '7',
  },
  // {
  //   title: '员工申请提醒',
  //   value: '4',
  // },
  {
    title: '派工任务',
    value: '9',
  },
  {
    title: '建议反馈回复提醒',
    value: '10',
  },
  {
    title: '跟进信息',
    value: '11',
  },
  {
    title: '企业认证状态更新',
    value: '12',
  },
];

class Msgtype extends PureComponent {
  changeSelect = (value) => {
    const { dispatch } = this.props;
    dispatch({
      type: '$getSystemsgList',
      payload: {
        type: value,
        current: 1,
      },
    });
    dispatch({
      type: 'updateState',
      payload: {
        query: {
          type: value,
        },
        current: 1,
      },
    });
  };

  render() {
    const { query } = this.props;
    return (
      <Fragment>
        <FormItem label="消息类别" {...formItemLayout}>
          <Select
            style={{ width: '168px' }}
            placeholder="全部"
            onChange={this.changeSelect}
            defaultValue={query.type || ''}
          >
            {typeList.map((item) => (
              <Option value={item.value} key={item.value}>
                {item.title}
              </Option>
            ))}
          </Select>
        </FormItem>
      </Fragment>
    );
  }
}
export default connect(({ query }) => ({ query }))(Msgtype);
