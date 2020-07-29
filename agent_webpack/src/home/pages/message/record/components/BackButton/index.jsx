import React, { PureComponent } from 'react';
import { connect } from 'nuomi';
import { Button } from 'antd';

class BackButton extends PureComponent {
  back = () => {
    const { dispatch, query, tabType } = this.props;
    const urlType = ['$getTimingList', '$getSuccessList', '$getFailedList'][Number(tabType) - 1];
    dispatch({
      type: urlType,
      payload: {
        ...query,
      },
    });

    dispatch({
      type: 'updateState',
      payload: {
        displayType: 0,
        detailQuery: {},
        detailInfo: {},
        selectedRowKeys: [],
      },
    });
  };

  render() {
    return <Button onClick={this.back}>返回</Button>;
  }
}
export default connect(({ tabType, query }) => ({ tabType, query }))(BackButton);
