import React, { PureComponent } from 'react';
import { connect } from 'nuomi';
import { trim } from 'lodash';
import { Input } from 'antd';

const { Search } = Input;
class DetailSearch extends PureComponent {
  search = (value, flag) => {
    if (flag === 1 && value) {
      return false;
    }
    const {
      dispatch,
      detailQuery: { customerName, ...rest },
      detailInfo: { msgId, realSendTime },
      isIgnore,
      tabType,
    } = this.props;
    const searchValue = value && { customerName: trim(value) };
    const isSuccess = tabType === '2';
    dispatch({
      type: '$getDetail',
      payload: {
        msgId,
        realSendTime,
        ...(tabType === '3' ? { isIgnore } : {}),
        isSuccess,
        ...rest,
        ...searchValue,
      },
    });
    dispatch({
      type: 'updateState',
      payload: {
        detailQuery: {
          ...rest,
          ...searchValue,
        },
      },
    });
  };

  render() {
    return (
      <Search
        allowClear
        placeholder="请输入客户名称搜索"
        style={{ width: '320px' }}
        onSearch={(value) => this.search(value)}
        onChange={(e) => this.search(e.target.value, 1)}
        enterButton
      />
    );
  }
}
export default connect(({ detailInfo, detailQuery, isIgnore, tabType }) => ({
  detailInfo,
  detailQuery,
  isIgnore,
  tabType,
}))(DetailSearch);
