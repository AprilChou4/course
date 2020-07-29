import React, { Component } from 'react';
import { Form, Input } from 'antd';
import { SearchInput } from '@components';

const wrapperStyle = {
  width: 420,
  paddingTop: 18,
};
const formItemLayout = {
  labelCol: {
    sm: { span: 5 },
  },
  wrapperCol: {
    sm: { span: 18 },
  },
};

export default class extends Component {
  getValue = (searchData) => {
    const values = [];
    if (searchData.length) {
      searchData.forEach((ele) => {
        const text = Array.isArray(ele.text) ? ele.text.join('、') : ele.text;
        if (text) {
          values.push(`${ele.title}：${text}`);
        }
      });
      return values.join('；');
    }
    // return name;
  };

  onSearch = (data, searchData) => {
    console.log(data, searchData, '我是onSeach方法');
  };

  getContent = ({ getFieldDecorator }) => {
    return (
      <div style={wrapperStyle}>
        <Form.Item label="服务类型" {...formItemLayout}>
          {getFieldDecorator('serviceTypeValue', {
            initialValue: '',
          })(<Input placeholder="请输入" autoComplete="off" />)}
        </Form.Item>
      </div>
    );
  };

  // 获取搜索值，填充至输入框
  getSearchData = (data) => {
    const searchData = [];
    Object.keys(data).forEach((key) => {
      const value = data[key];
      if (value && value.length) {
        switch (key) {
          case 'serviceTypeValue':
            searchData.push({
              title: '服务类型',
              text: [].concat(value),
            });
            break;
          default:
            break;
        }
      }
    });
    return searchData;
  };

  render() {
    return (
      <SearchInput
        name="customerName"
        autoComplete="off"
        style={{ width: 350 }}
        placeholder="请输入客户名称/客户编码搜索"
        // getValue={inputValue}
        // value=""
        getValue={this.getValue}
        getContent={this.getContent}
        getSearchData={this.getSearchData}
        onSearch={this.onSearch}
        // moreChange={this.moreChange}
        // defaultValue={inputValue}
      />
    );
  }
}
