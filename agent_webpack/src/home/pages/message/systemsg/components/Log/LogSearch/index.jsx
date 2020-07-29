// 系统消息>操作日志搜索
import React, { PureComponent } from 'react';
import { connect } from 'nuomi';
import { trim } from 'lodash';
import { Input } from 'antd';

const { Search } = Input;
class DetailSearch extends PureComponent {
  search = (value, flag) => {
    // 防止边输边搜索
    if (flag === 1 && value) {
      return false;
    }
    const { dispatch } = this.props;
    const searchValue = value && { searchContent: trim(value) };
    dispatch({
      type: '$getLogList',
      payload: {
        ...searchValue,
      },
    });
    dispatch({
      type: 'updateState',
      payload: {},
    });
  };

  render() {
    return (
      <Search
        allowClear
        placeholder="请输入操作对象或操作内容搜索"
        style={{ width: '320px' }}
        onSearch={(value) => this.search(value)}
        onChange={(e) => this.search(e.target.value, 1)}
        enterButton
      />
    );
  }
}
export default connect()(DetailSearch);
