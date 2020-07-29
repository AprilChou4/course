// 消息记录>发送失败 > 查看已忽略、未忽略消息
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'nuomi';
import { Button } from 'antd';

class MsgButton extends PureComponent {
  clickBtn = () => {
    const { dispatch, isIgnore, query } = this.props;
    dispatch({
      type: '$getFailedList',
      payload: {
        isIgnore: !isIgnore,
        ...query,
      },
    });
    dispatch({
      type: 'updateState',
      payload: {
        isIgnore: !isIgnore,
      },
    });
  };

  render() {
    const { tabType, isIgnore } = this.props;
    const btnType = isIgnore ? { ghost: true } : {};
    return (
      <Fragment>
        {tabType === '3' && (
          <Button type="primary" onClick={this.clickBtn} {...btnType}>
            {isIgnore ? '查看未忽略消息' : '查看已忽略消息'}
          </Button>
        )}
      </Fragment>
    );
  }
}
export default connect(({ tabType, displayType, isIgnore, query }) => ({
  tabType,
  displayType,
  isIgnore,
  query,
}))(MsgButton);
