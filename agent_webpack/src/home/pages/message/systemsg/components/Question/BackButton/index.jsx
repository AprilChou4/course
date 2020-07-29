import React, { PureComponent } from 'react';
import { connect } from 'nuomi';
import { Button } from 'antd';

class BackButton extends PureComponent {
  back = () => {
    const { dispatch } = this.props;
    dispatch({
      type: '$getQuesList',
    });

    dispatch({
      type: 'updateState',
      payload: {
        displayType: 0,
        // selectedRowKeys: [],
      },
    });
  };

  render() {
    return <Button onClick={this.back}>返回</Button>;
  }
}
export default connect(({ tabType, query }) => ({ tabType, query }))(BackButton);
