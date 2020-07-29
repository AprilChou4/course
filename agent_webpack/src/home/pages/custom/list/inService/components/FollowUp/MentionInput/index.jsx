// @人输入框
import React, { Component } from 'react';
import { Form, Mentions, Button, message } from 'antd';
import { connect } from 'nuomi';
import Style from './style.less';

const { Option, getMentions } = Mentions;

@Form.create()
class MentionInput extends Component {
  constructor(props) {
    super(props);
    this.mentionInput = React.createRef();
    this.state = {
      isFocus: false,
      selectEmp: [], // 已@的客户
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'updateState',
      payload: {
        mentionInput: this.mentionInput,
      },
    });
  }

  componentWillReceiveProps() {
    const {
      form: { resetFields },
    } = this.props;
    resetFields();
  }

  //  保存跟进信息
  save = (e) => {
    const { selectEmp } = this.state;
    const {
      dispatch,
      currRecord: { customerId, customerName },
      form: { setFieldsValue, validateFields },
      editFollowItem,
    } = this.props;
    e.preventDefault();
    validateFields((errors, values) => {
      if (errors) {
        return;
      }
      const url = editFollowItem.customerFollowId ? '$updateFollow' : '$addFollow';
      // const list = selectEmp.filter((v) => values.content.includes(`@${v.name}`));
      // let staffIdArr = [];
      // list.forEach((item) => {
      //   staffIdArr = [...staffIdArr, item.staffId];
      // });
      const staffIdArr = selectEmp.map((item) => item.staffId);
      dispatch({
        type: url,
        payload: {
          ...values,
          customerFollowId: editFollowItem.customerFollowId || '',
          customerId,
          customerName,
          sendStaffIdList: staffIdArr,
        },
      }).then(() => {
        setFieldsValue({ content: '' });
        this.setState({
          isFocus: false,
          selectEmp: [],
        });
      });
    });
  };

  // 鼠标focus
  focusMention = () => {
    this.setState({
      isFocus: true,
    });
  };

  // 鼠标失焦
  blurMention = () => {
    this.setState({
      isFocus: false,
    });
  };

  // 阻止冒泡
  stopBubble = (e) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
  };

  // 选择提及人
  selectMention = (option) => {
    const { selectEmp } = this.state;
    const {
      editFollowItem,
      dispatch,
      staffList,
      form: { getFieldsValue, setFieldsValue },
    } = this.props;
    this.setState({
      selectEmp: [...selectEmp, option.item],
    });
    let contentVal = getFieldsValue(['content']).content;
    staffList &&
      staffList.forEach((val) => {
        if (contentVal.indexOf(`@${val.staffId}`) >= 0) {
          contentVal = contentVal.replace(`@${val.staffId}`, `@${val.realName}`);
        }
      });
    dispatch({
      type: 'updateState',
      payload: {
        editFollowItem: {
          ...editFollowItem,
          content: contentVal,
        },
      },
    });
    setFieldsValue({ content: contentVal });
  };

  filterOption = (input, option) => {
    return option.item.realName.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  };

  changeMention = (text) => {
    const { dispatch, editFollowItem } = this.props;
    dispatch({
      type: 'updateState',
      payload: {
        editFollowItem: {
          ...editFollowItem,
          content: text,
        },
      },
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      editFollowItem,
      staffList,
    } = this.props;
    const { isFocus } = this.state;
    return (
      <Form className={Style['m-followMention']}>
        <Form.Item label={null} wrapperCol={isFocus ? { span: 21 } : { span: 24 }}>
          {getFieldDecorator('content', {
            initialValue: editFollowItem.content || '',
          })(
            <Mentions
              rows="3"
              ref={this.mentionInput}
              onFocus={this.focusMention}
              onClick={this.stopBubble}
              onChange={this.changeMention}
              onSelect={this.selectMention}
              filterOption={this.filterOption}
              placeholder="请输入跟进信息，输入@可添加关联人"
              maxLength={500}
            >
              {staffList.map((item) => (
                <Option value={item.staffId} key={item.staffId} item={item}>
                  {item.realName}
                </Option>
              ))}
            </Mentions>,
          )}
          <div className={Style['text-all']}>
            <span>{editFollowItem.content ? editFollowItem.content.length : 0}</span>
            <span>/500</span>
          </div>
          {isFocus && (
            <Button type="primary" onClick={this.save}>
              保存
            </Button>
          )}
        </Form.Item>
      </Form>
    );
  }
}
export default connect(({ currRecord, editFollowItem, staffList }) => ({
  currRecord,
  editFollowItem,
  staffList,
}))(MentionInput);
