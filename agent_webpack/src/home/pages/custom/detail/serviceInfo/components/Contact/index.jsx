// 联系人
import React, { Component } from 'react';
import { connect } from 'nuomi';
import { cloneDeep } from 'lodash';
import { Form, Input, Select, Checkbox, List, message } from 'antd';
import TextButton from '@components/TextButton';
import Style from './style.less';

const FormItem = Form.Item;
const { Option } = Select;
const formItemLayout = {
  labelCol: {
    sm: { span: 7 },
  },
  wrapperCol: {
    sm: { span: 17 },
  },
};
class Contact extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillReceiveProps(nextP) {
    const { dispatch, customerContactList } = nextP;
    const addItem = {
      creator: '',
      customerContactId: '',
      edit: true,
      email: '',
      job: '',
      normal: 1,
      phone: '',
      qq: '',
      realName: '',
      remark: '',
      sex: 0,
      telephone: '',
      userId: '',
    };
    if (customerContactList && !customerContactList.length) {
      dispatch({
        type: 'updateState',
        payload: {
          customerContactList: [addItem],
        },
      });
    }
  }

  // 常用联系人
  onChangeNomal = (e, index) => {
    const { checked } = e.target;
    const { dispatch, customerContactList } = this.props;
    const arr = cloneDeep(customerContactList);
    arr.forEach((v) => (v.normal = false));
    arr[index].normal = checked;
    dispatch({
      type: 'updateState',
      payload: {
        customerContactList: arr,
      },
    });
  };

  onChangePhone = (e, index) => {
    const { dispatch, form, customerContactList } = this.props;
    const { setFieldsValue } = form;

    const arr = cloneDeep(customerContactList);
    arr[index].phone = e.target.value;
    const data = {};
    data[`customerContactList[${index}]['userId']`] = '';
    setFieldsValue(data);
    dispatch({
      type: 'updateState',
      payload: {
        customerContactList: arr,
      },
    });
  };

  // 授权查账
  onChangeAssign = async (e, index) => {
    const { checked } = e.target;
    const { dispatch, form, customerContactList } = this.props;
    const { setFieldsValue } = form;
    const arr = cloneDeep(customerContactList);
    const username = arr[index].phone;
    if (username === '' && checked) {
      message.warning('请输入手机号');
      arr[index].userId = '';
    } else {
      if (!checked) {
        arr[index].userId = '';
        const data = {};
        data[`customerContactList[${index}]['userId']`] = '';
        setFieldsValue(data);
        dispatch({
          type: 'updateState',
          payload: {
            customerContactList: arr,
          },
        });
        return false;
      }
      dispatch({
        type: '$getUserByName',
        payload: {
          username,
          arr,
          index,
        },
      });
    }
  };

  // 改变联系人信息
  onChangeContact = (e, index, item) => {
    const { field, type } = item;
    const { dispatch, customerContactList } = this.props;
    const arr = cloneDeep(customerContactList);
    arr[index][field] = type === 'Input' ? e.target.value : e;
    dispatch({
      type: 'updateState',
      payload: {
        customerContactList: arr,
      },
    });
  };

  // 添加联系人
  add = () => {
    const { dispatch, customerContactList } = this.props;
    const arr = cloneDeep(customerContactList);
    arr.forEach((val) => {
      val.normal = false;
    });
    const addItem = {
      creator: '',
      customerContactId: '',
      edit: true,
      email: '',
      job: '',
      normal: true,
      phone: '',
      qq: '',
      realName: '',
      remark: '',
      sex: 0,
      telephone: '',
      userId: '',
    };

    dispatch({
      type: 'updateState',
      payload: {
        customerContactList: [...arr, addItem],
      },
    });
  };

  // 删除
  del = (key) => {
    const { dispatch, customerContactList } = this.props;
    const newArr = customerContactList.filter((v, index) => key !== index);
    dispatch({
      type: 'updateState',
      payload: {
        customerContactList: newArr,
      },
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      customerContactList,
      isEdit,
    } = this.props;
    const isDisabled = { disabled: !isEdit };

    // 联系人数据
    const data = [
      {
        name: '姓名',
        type: 'Input',
        field: 'realName',
      },
      {
        name: '职务',
        type: 'Select',
        field: 'job',
        options: [
          {
            name: '老板',
            value: '1',
          },
          {
            name: '出纳',
            value: '2',
          },
          {
            name: '其他',
            value: '3',
          },
        ],
      },
      {
        name: '性别',
        type: 'Select',
        field: 'sex',
        options: [
          {
            name: '男',
            value: 1,
          },
          {
            name: '女',
            value: 2,
          },
        ],
      },
      {
        name: '手机号',
        type: 'Input',
        field: 'phone',
        onChange: (e, key) => this.onChangePhone(e, key),
        validator: [
          {
            pattern: /^0?1[3-9][0-9]{9}$/,
            message: '手机格式不正确',
          },
        ],
      },
      {
        name: '固定电话',
        type: 'Input',
        field: 'telephone',
        validator: [
          {
            pattern: /^[0-9-()（）]{7,18}$/,
            message: '固定电话格式有误',
          },
        ],
      },
      {
        name: '邮箱',
        type: 'Input',
        field: 'email',
        validator: [
          {
            pattern: /^\w+((-w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/,
            message: '邮箱格式有误',
          },
        ],
      },
      {
        name: 'QQ',
        type: 'Input',
        field: 'qq',
        validator: [
          {
            pattern: /^[0-9]+$/,
            message: 'qq格式有误',
          },
        ],
      },
      {
        name: '备注',
        type: 'Input',
        field: 'remark',
      },
    ];
    return (
      <div className={Style['m-contact']}>
        {customerContactList &&
          customerContactList.map((pane, key) => (
            <List
              key={key}
              grid={{ gutter: 16, column: 3 }}
              header={
                <div>
                  <span className={Style['m-index']}>
                    联系人
                    {key + 1}
                  </span>
                  {getFieldDecorator(`customerContactList[${key}]['customerContactId']`, {
                    initialValue: pane.customerContactId || '',
                  })(<Input type="hidden" />)}
                  {getFieldDecorator(`customerContactList[${key}]['userId']`, {
                    initialValue: pane.userId || '',
                  })(<Input type="hidden" />)}
                  {getFieldDecorator(`customerContactList[${key}]['normal']`, {
                    initialValue: pane.normal ? pane.normal : undefined,
                  })(
                    <Checkbox
                      {...isDisabled}
                      onChange={(e) => this.onChangeNomal(e, key)}
                      checked={pane.normal}
                    >
                      常用联系人
                    </Checkbox>,
                  )}
                  {/* {getFieldDecorator(`customerContactList[${key}]['isAssign']`, {})( */}
                  <Checkbox
                    {...isDisabled}
                    onChange={(e) => this.onChangeAssign(e, key)}
                    checked={pane.userId !== ''}
                  >
                    授权查账
                  </Checkbox>
                  {/* )} */}
                  {key !== 0 && (
                    <i className={`iconfont ${Style['m-del']}`} onClick={() => this.del(key)}>
                      &#xeb2f;
                    </i>
                  )}
                </div>
              }
              dataSource={data}
              renderItem={(item) => {
                const { onChange, ...rest } = item;
                const component =
                  item.type === 'Input' ? (
                    <Input
                      placeholder={isEdit ? `请输入${item.name}` : '-'}
                      {...isDisabled}
                      autoComplete="off"
                      {...(onChange
                        ? { onChange: (e) => onChange(e, key) }
                        : { onChange: (e) => this.onChangeContact(e, key, item) })}
                    />
                  ) : (
                    <Select
                      placeholder={isEdit ? `请输入${item.name}` : '-'}
                      {...isDisabled}
                      {...(onChange
                        ? { onChange: (e) => onChange(e, key) }
                        : { onChange: (e) => this.onChangeContact(e, key, item) })}
                    >
                      {item.options.map(({ value, name }) => (
                        <Option key={value} value={value}>
                          {name}
                        </Option>
                      ))}
                    </Select>
                  );
                const noValue = item.type === 'Input' ? '' : undefined;
                return (
                  <List.Item>
                    <FormItem label={item.name} {...formItemLayout}>
                      {getFieldDecorator(`customerContactList[${key}][${item.field}]`, {
                        initialValue: pane[item.field] ? pane[item.field] : noValue,
                        ...(item.validator ? { rules: item.validator } : {}),
                      })(component)}
                    </FormItem>
                  </List.Item>
                );
              }}
            />
          ))}

        <TextButton className={Style['m-add']} onClick={this.add} {...isDisabled}>
          <i className="iconfont">&#xea73;</i>新建联系人
        </TextButton>
      </div>
    );
  }
}
export default connect(({ serviceInfoDetail, customerContactList, isEdit }) => ({
  serviceInfoDetail,
  customerContactList,
  isEdit,
}))(Contact);
