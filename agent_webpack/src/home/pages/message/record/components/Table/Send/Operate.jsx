import React, { Component, Fragment } from 'react';
import { message } from 'antd';
import PropTypes from 'prop-types';
import { connect } from 'nuomi';
import trackEvent from 'trackEvent';
import TextButton from '@components/TextButton';
import Authority from '@components/Authority';
import ShowConfirm from '@components/ShowConfirm';

class Operate extends Component {
  // 详情
  detail = () => {
    const { dispatch, record } = this.props;
    dispatch({
      type: 'updateState',
      payload: {
        isDetailVisible: true,
        currRecord: record,
        detailModalType: 0,
      },
    });
  };

  // 编辑
  edit = () => {
    const {
      dispatch,
      record: { msgId },
    } = this.props;
    dispatch({
      type: 'getCurrentMessage',
      payload: msgId,
    });
  };

  // 删除
  delete = () => {
    const {
      total,
      current,
      pageSize,
      dispatch,
      record: { msgId },
    } = this.props;
    ShowConfirm({
      title: '确定要删除本条定时消息吗？',
      content: '删除后系统将不会再定时发送本条消息；不影响已发送的消息。',
      onOk() {
        const isExist = Math.ceil((total - 1) / pageSize) < current;
        dispatch({
          type: '$deleteTiming',
          payload: {
            msgId,
          },
        }).then(() => {
          message.success('删除成功');
          dispatch({
            type: '$getTimingList',
            payload: {
              current: isExist ? current - 1 : current,
            },
          });
        });
      },
    });
  };

  // 开户
  openAccount = () => {
    router.location(`/jumpIcbc?id=${id}`);// 刷新路由
    trackEvent('客户管理', '开户跳转');
  };

  render() {
    return (
      <Fragment>
        <Authority>
          <TextButton onClick={() => this.detail()}>详情</TextButton>
        </Authority>
        <Authority code="549">
          <TextButton onClick={this.edit}>编辑</TextButton>
        </Authority>
        <Authority code="549">
          <TextButton onClick={this.delete}>删除</TextButton>
        </Authority>
      </Fragment>
    );
  }
}

Operate.propTypes = {
  record: PropTypes.object,
};

export default connect(({ total, current, pageSize }) => ({ total, current, pageSize }))(Operate);
