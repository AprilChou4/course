import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { message } from 'antd';
import { connect } from 'nuomi';
import trackEvent from 'trackEvent';
import TextButton from '@components/TextButton';
import ShowConfirm from '@components/ShowConfirm';
import Authority from '@components/Authority';

class Operate extends PureComponent {
  // 详情
  detail = () => {
    const { dispatch, isIgnore, record } = this.props;
    const { msgId, realSendTime } = record;
    dispatch({
      type: '$getDetail',
      payload: {
        msgId,
        realSendTime,
        isSuccess: false,
        isIgnore,
      },
    });
    dispatch({
      type: 'updateState',
      payload: {
        displayType: 1,
        currRecord: record,
      },
    });
  };

  // 重新发送显示弹窗
  resend = () => {
    const { dispatch, record } = this.props;
    dispatch({
      type: 'updateState',
      payload: {
        isDetailVisible: true,
        currRecord: record,
        detailModalType: 1,
      },
    });
  };

  // 忽略
  ignore = () => {
    trackEvent('消息记录', '发送失败', '忽略'); // 事件埋点
    const { dispatch, record } = this.props;
    const { msgId, realSendTime } = record;
    ShowConfirm({
      title: '确定要忽略该消息吗？',
      content:
        '“忽略”后，系统将不再提醒您本条发送失败的消息，但您仍可以点击“已忽略”按钮查看或重新发送该消息。',
      width: 388,
      okText: '忽略',
      onOk() {
        dispatch({
          type: '$ignoreFailed',
          payload: {
            msgId,
            realSendTime,
          },
        }).then(() => {
          dispatch({
            type: '$getFailedList',
          });
          dispatch({
            type: '$getRedDot',
          });
          message.success('该消息已忽略');
        });
      },
    });
  };

  render() {
    const { isIgnore } = this.props;
    return (
      <span>
        <TextButton onClick={this.detail}>详情</TextButton>
        <Authority code="551">
          <TextButton onClick={this.resend}>重新发送</TextButton>
        </Authority>
        <Authority code="550">
          {!isIgnore && <TextButton onClick={this.ignore}>忽略</TextButton>}
        </Authority>
      </span>
    );
  }
}

Operate.propTypes = {
  record: PropTypes.object,
};

export default connect(({ isIgnore }) => ({ isIgnore }))(Operate);
