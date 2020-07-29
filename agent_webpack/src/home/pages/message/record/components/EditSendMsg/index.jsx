// 定时发送>编辑
import React, { PureComponent } from 'react';
import { connect } from 'nuomi';
import BackButton from '../BackButton';
import MessageForm from '../../../send/components/MessageForm';
import './index.less';

class EditSendMsg extends PureComponent {
  handleSuccess = () => {
    const { dispatch, query } = this.props;
    dispatch({
      type: '$getTimingList',
      payload: {
        ...query,
      },
    });
    dispatch({
      type: 'updateState',
      payload: {
        currentEditMessage: {},
        displayType: 0,
      },
    });
  };

  render() {
    const { currentEditMessage } = this.props;
    return (
      <div>
        <BackButton />
        <div styleName="tip-text">消息会发送到客户“授权查账”的账号的诺言端</div>
        <MessageForm messageData={currentEditMessage} onSuccessCallBack={this.handleSuccess} />
      </div>
    );
  }
}
export default connect(({ currentEditMessage, query }) => ({
  currentEditMessage,
  query,
}))(EditSendMsg);
