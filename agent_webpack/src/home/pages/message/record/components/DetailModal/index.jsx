// 消息记录 > 定时消息详情/重新发送弹窗
import React, { Component, Fragment } from 'react';
import { Modal, Form, message } from 'antd';
import { connect } from 'nuomi';
import ShowConfirm from '@components/ShowConfirm';
import TargetTable from './TargetTable';
import Style from './style.less';

const formItemLayout = {
  labelCol: {
    sm: { span: 3 },
  },
  wrapperCol: {
    sm: { span: 21 },
  },
};

@connect(
  ({
    isDetailVisible,
    detailModalType,
    tabType,
    currRecord,
    displayType,
    query,
    selectedRowKeys,
    isIgnore,
  }) => ({
    isDetailVisible,
    detailModalType,
    tabType,
    currRecord,
    displayType,
    query,
    selectedRowKeys,
    isIgnore,
  }),
)
class DetailModal extends Component {
  onCancel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'updateState',
      payload: {
        isDetailVisible: false,
      },
    });
  };

  // 重新发送
  resend = () => {
    const {
      dispatch,
      displayType,
      tabType,
      currRecord,
      query,
      selectedRowKeys,
      isIgnore,
    } = this.props;
    const { customers, msgId, msgContent, msgTitle, realSendTime, msgTemplateId } = currRecord;
    let sendObjects = [];
    const recordIds = [];
    if (displayType === 0) {
      // 列表重新发送
      customers.forEach((item) => {
        const obj = {};
        const grantUserIds = [];
        item.grantUsers.forEach((val) => {
          // 列表重新发送、详情重新发送
          grantUserIds.push(val.userId);
          recordIds.push(val.recordId);
        });
        obj.customerId = item.customerId;
        obj.grantUserIds = grantUserIds;
        sendObjects = [...sendObjects, obj];
      });
    } else {
      customers.forEach((item) => {
        const obj = {};
        const grantUserIds = [];
        item.grantUsers.forEach((val) => {
          if (selectedRowKeys.includes(val.recordId)) {
            grantUserIds.push(val.userId);
            recordIds.push(val.recordId);
          }
        });
        // 判断是否匹配到
        if (!grantUserIds.length) {
          return false;
        }
        obj.customerId = item.customerId;
        obj.grantUserIds = grantUserIds;
        sendObjects = [...sendObjects, obj];
      });
    }

    const sendObj = {
      sendObjects,
      msgId,
      msgTitle,
      // msgContent,
      sendTime: realSendTime,
      recordIds,
      msgTemplateId,
    };

    dispatch({
      type: '$sendCheck',
      payload: {
        ...sendObj,
      },
    }).then((res) => {
      const onOkSend = () => {
        dispatch({
          type: '$msgResend',
          payload: {
            ...sendObj,
          },
        }).then(() => {
          message.success('发送成功！');
          dispatch({
            type: '$getRedDot',
          });
          if (displayType === 0) {
            dispatch({
              type: '$getFailedList',
              payload: {
                ...query,
              },
            });
          } else {
            dispatch({
              type: '$getDetail',
              payload: {
                msgId,
                realSendTime,
                isSuccess: false,
                ...(tabType === '3' ? { isIgnore } : {}),
              },
            });
          }

          dispatch({
            type: 'updateState',
            payload: {
              isDetailVisible: false,
              // displayType: 0,
            },
          });
        });
      };
      if (!res.result.length) {
        onOkSend();
      } else {
        // type 类型：Number  必有字段  备注：1-用户授权状态 2-客户状态 3-客户权限
        const msgObj = {};
        res.result.forEach((item) => {
          msgObj[`msg${item.type}`] = item.msg;
        });
        const { msg1, msg2, msg3 } = msgObj;
        ShowConfirm({
          title: '确定要发送吗？',
          width: 512,
          content: (
            <div>
              {msg1 && (
                <Fragment>
                  <div>以下客户未被授权查账，消息将无法发送至客户！</div>
                  <div>（{msg1}）</div>
                </Fragment>
              )}
              {msg2 && (
                <Fragment>
                  <div>以下客户已被停止服务，消息将无法发送至客户！</div>
                  <div>（{msg2}）</div>
                </Fragment>
              )}
              {msg3 && (
                <Fragment>
                  <div>以下客户不在您的权限下，消息将无法发送至客户！</div>
                  <div>（{msg3}）</div>
                </Fragment>
              )}
            </div>
          ),
          onOk() {
            // 请求
            // dispatch({
            //   type: '$msgResend',
            //   payload: {
            //     ...sendObj,
            //   },
            // }).then(() => {
            //   dispatch({
            //     type: '$getRedDot',
            //   });
            // });
            onOkSend();
          },
        });
      }
    });
  };

  render() {
    const { isDetailVisible, detailModalType, currRecord } = this.props;
    const { msgTitle, msgContent } = currRecord;
    const title = ['定时消息详情', '重新发送'][detailModalType];
    const options = [
      {
        footer: null,
      },
      {
        okText: '重新发送',
        onOk: this.resend,
      },
    ][detailModalType];
    return (
      <Modal
        className={Style['msgrecord-detailModal']}
        title={title}
        visible={isDetailVisible}
        width={600}
        maskClosable={false}
        centered
        destroyOnClose
        onCancel={this.onCancel}
        {...options}
      >
        <Form {...formItemLayout}>
          <Form.Item label="消息主题">{msgTitle}</Form.Item>
          <Form.Item label="消息内容">{msgContent}</Form.Item>
          <Form.Item label="发送对象">
            <TargetTable />
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}
export default DetailModal;
