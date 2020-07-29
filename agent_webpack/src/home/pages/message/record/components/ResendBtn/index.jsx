import React, { PureComponent, Fragment } from 'react';
import { Button, message } from 'antd';
import { connect } from 'nuomi';

class ResendBtn extends PureComponent {
  resend = () => {
    const { dispatch, currRecord, detailInfo, selectedRowKeys } = this.props;
    if (!selectedRowKeys.length) {
      message.warning('请选择重新发送对象');
      return false;
    }
    dispatch({
      type: 'updateState',
      payload: {
        detailModalType: 1,
        isDetailVisible: true,
        currRecord: { ...detailInfo, msgContent: currRecord.msgContent },
      },
    });
  };

  render() {
    const { tabType } = this.props;
    return (
      <Fragment>
        {tabType === '3' ? (
          <Button type="primary" onClick={this.resend}>
            重新发送
          </Button>
        ) : (
          ''
        )}
      </Fragment>
    );
  }
}
export default connect(({ detailInfo, currRecord, tabType, selectedRowKeys }) => ({
  detailInfo,
  currRecord,
  tabType,
  selectedRowKeys,
}))(ResendBtn);
