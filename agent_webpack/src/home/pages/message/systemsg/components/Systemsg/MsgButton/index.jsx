// 系统消息> 标为已读
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'nuomi';
import { Button, message } from 'antd';

class MsgButton extends PureComponent {
  clickBtn = () => {
    const { selectedRowKeys, selectedRows, dispatch } = this.props;
    if (!selectedRowKeys.length) {
      message.warning('请选择标记行');
    } else {
      const noReadRows = selectedRows.filter((v) => v.isRead === 0);
      if (noReadRows.length) {
        const noticeIds = [];
        noReadRows.forEach((item) => {
          noticeIds.push(item.noticeId);
        });
        dispatch({
          type: '$updateNotice',
          payload: {
            noticeIds,
          },
        });
      } else {
        message.warning('所选行未包含未读信息');
      }
    }
    dispatch({
      type: '$getFailedList',
      payload: {},
    });
  };

  render() {
    return (
      <Fragment>
        <Button type="primary" onClick={this.clickBtn}>
          标为已读
        </Button>
      </Fragment>
    );
  }
}
export default connect(({ selectedRowKeys, selectedRows }) => ({
  selectedRowKeys,
  selectedRows,
}))(MsgButton);
