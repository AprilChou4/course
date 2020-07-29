// 消息记录>更多条件搜索
import React, { PureComponent } from 'react';
import { Form, Input, DatePicker } from 'antd';
import { connect } from 'nuomi';
import moment from 'moment';
// import actions from '../../store/actions';
import SearchInput from '@components/SearchInput';

const { RangePicker } = DatePicker;
const formItemLayout = {
  labelCol: {
    sm: { span: 5 },
  },
  wrapperCol: {
    sm: { span: 18 },
  },
};

const wrapperStyle = {
  width: 420,
  paddingTop: 18,
};
const toTime = (time) => moment(Number(time)).format('YYYY-MM-DD');
class MoreSearch extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // componentDidMount() {
  //   const { query } = this.props;
  //   const searchData = this.getSearchData(query);
  //   this.getValue(searchData);
  // }

  onSearch = (data, searchData) => {
    const { dispatch, tabType, isIgnore } = this.props;
    const cloneData = { ...data };
    // if (Object.keys(data).length) {
    // if (!searchData.length) {
    //   if (cloneData.name !== undefined) {
    //     cloneData.status = status;
    //   } else {
    //     cloneData.name = name;
    //   }
    // }
    // }
    Object.keys(cloneData).forEach((key) => {
      if (key === 'time') {
        if (cloneData[key]) {
          const { operateTimeMin, operateTimeMax } = cloneData[key];
          cloneData.operateTimeMin = operateTimeMin;
          cloneData.operateTimeMax = operateTimeMax;
          delete cloneData[key];
        }
      }
    });
    const urlType = ['$getTimingList', '$getSuccessList', '$getFailedList'][Number(tabType) - 1];
    // 发送成功、发送失败时间字段名与定时发送不相同
    const paramsData = { ...cloneData };
    if (paramsData.operateTimeMin && (tabType === '2' || tabType === '3')) {
      paramsData.sendTimeMin = paramsData.operateTimeMin;
      paramsData.sendTimeMax = paramsData.operateTimeMax;
      delete paramsData.operateTimeMin;
      delete paramsData.operateTimeMax;
    }
    if (paramsData.msgTitles) {
      paramsData.msgTitle = paramsData.msgTitles;
    }
    dispatch({
      type: urlType,
      payload: {
        ...paramsData,
        ...(tabType === '3' ? { isIgnore } : {}),
        current: 1,
      },
    });
    dispatch({
      type: 'updateState',
      payload: {
        current: 1,
        query: { ...cloneData },
      },
    });
  };

  getSearchData = (data) => {
    const searchData = [];
    const formatTime = (time, key) =>
      Number(
        moment(time)
          [key]('day')
          .format('x'),
      );
    const operateTime = data.time;
    if (Array.isArray(operateTime)) {
      // 起始时间0点、结束时间23：59
      operateTime.operateTimeMin = formatTime(operateTime[0], 'startOf');
      operateTime.operateTimeMax = formatTime(operateTime[1], 'endOf');
    }
    Object.keys(data).forEach((i) => {
      const value = data[i];
      if (value && value.length) {
        switch (i) {
          case 'msgTitle':
            searchData.push({
              title: '消息主题',
              text: value,
            });
            break;
          case 'msgContent':
            searchData.push({
              title: '消息内容',
              text: value,
            });
            break;
          case 'time': {
            const minTime = toTime(value.operateTimeMin);
            const maxTime = toTime(value.operateTimeMax);
            searchData.push({
              title: '操作时点',
              text: `${minTime}~${maxTime}`,
            });
            break;
          }
          case 'customerName':
            searchData.push({
              title: '发送对象',
              text: value,
            });
            break;
          default:
            break;
        }
      }
    });
    return searchData;
  };

  getValue = (searchData) => {
    // const { query: { name } } = this.props;
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

  getContent = ({ getFieldDecorator }) => {
    const { query } = this.props;
    let inialalTime = null;
    if (query.operateTimeMin) {
      inialalTime = [moment(toTime(query.operateTimeMin)), moment(toTime(query.operateTimeMax))];
    }
    return (
      <div style={wrapperStyle}>
        <Form.Item label="消息主题" {...formItemLayout}>
          {getFieldDecorator('msgTitle', {
            initialValue: query.msgTitle || '',
          })(<Input placeholder="请输入消息主题" autoComplete="off" />)}
        </Form.Item>
        {/* <Form.Item label="消息内容" {...formItemLayout}>
          {getFieldDecorator('msgContent', {})(
            <Input placeholder="请输入消息内容" autoComplete="off" />,
          )}
        </Form.Item> */}
        <Form.Item label="发送对象" {...formItemLayout}>
          {getFieldDecorator('customerName', {
            initialValue: query.customerName || '',
          })(<Input placeholder="请输入客户名称" autoComplete="off" />)}
        </Form.Item>
        <Form.Item label="操作时点" {...formItemLayout}>
          {getFieldDecorator('time', {
            initialValue: inialalTime,
          })(<RangePicker placeholder={['开始日期', '结束日期']} />)}
        </Form.Item>
      </div>
    );
  };

  render() {
    const { query } = this.props;
    const searchData = this.getSearchData(query);
    const initInputValue = this.getValue(searchData);
    return (
      <SearchInput
        name="msgTitles"
        autoComplete="off"
        style={{ width: 320 }}
        placeholder="请输入消息主题搜索"
        getValue={this.getValue}
        getContent={this.getContent}
        getSearchData={this.getSearchData}
        onSearch={this.onSearch}
        defaultValue={initInputValue}
      />
    );
  }
}

export default connect(({ current, pageSize, query, tabType, isIgnore }) => ({
  current,
  pageSize,
  query,
  tabType,
  isIgnore,
}))(MoreSearch);
