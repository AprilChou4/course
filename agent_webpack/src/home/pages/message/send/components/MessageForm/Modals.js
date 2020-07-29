import React from 'react';
import { Modal, Icon } from 'antd';
import { router } from 'nuomi';
import ShowConfirm from '@components/ShowConfirm';

// 敏感词错误弹窗
export const showSensitiveWarning = (words) => {
  ShowConfirm({
    width: 400,
    title: '您输入的内容包含以下敏感词汇不允许发送，请修改！',
    content: words.join('；'),
    okText: '知道了',
  });
};

// 成功弹窗
export const showSuccess = (isTimeout, isTiming, callback) => {
  let modal;
  let title;
  let content;
  const toRecord = () => {
    callback && callback();
    modal.destroy();
    router.location('/message/record/', ({ store }) => {
      store.dispatch({
        type: 'updateState',
        payload: {
          tabType: isTiming ? '1' : '2',
        },
      });
      if (!isTiming) {
        store.dispatch({
          type: '$getSuccessList',
          payload: {},
        });
      } else {
        store.dispatch({
          type: '$getTimingList',
          payload: {},
        });
      }
    });
  };

  if (isTiming) {
    title = '定时消息设置成功！';
    content = (
      <div>
        系统会按照您设置的发送时点自动发送消息！
        <p>
          您也可以在
          <span className="highlight" onClick={toRecord}>
            【消息记录-定时发送】
          </span>
          菜单下修改您的定时消息或查看已发送的消息。
        </p>
      </div>
    );
  } else if (isTimeout) {
    title = '操作成功！';
    content = (
      <span>
        您要发送的消息数据量较大，系统全部发送完成可能需要几分钟。稍后您可以在
        <span className="highlight" onClick={toRecord}>
          【消息记录-发送成功】
        </span>
        菜单中查看已发送的消息
      </span>
    );
  } else {
    title = '发送成功！';
    content = (
      <span>
        您可以在
        <span className="highlight" onClick={toRecord}>
          【消息记录-发送成功】
        </span>
        菜单中查看已发送的消息。
      </span>
    );
  }

  modal = Modal.success({
    width: 400,
    icon: <i className="iconfont">&#xec94;</i>,
    className: 'send-message-dialog-confirm',
    title,
    content,
    okText: '知道了',
    onOk: callback,
  });
};

// 失败
export const showFail = (msg, callback) => {
  let modal;
  const toRecord = () => {
    callback && callback();
    router.location('/message/record/', ({ store }) => {
      store.dispatch({
        type: 'updateState',
        payload: {
          tabType: '3',
        },
      });
      store.dispatch({
        type: '$getFailedList',
        payload: {},
      });
    });
    modal.destroy();
  };
  modal = Modal.warning({
    width: 400,
    icon: <Icon type="exclamation-circle" theme="filled" />,
    className: 'send-message-dialog-confirm',
    title: msg,
    content: (
      <span>
        你可以在
        <span className="highlight" onClick={toRecord}>
          【消息记录-发送失败】
        </span>
        菜单中查看已发送的消息
      </span>
    ),
    okText: '知道了',
    onOk: callback,
  });
};

// 无授权
export const showUnauthorized = (list, isEdit, sendCallback) => {
  // 未授权查账
  const noCheckAccount = [];
  // 没有服务
  const noService = [];
  // 没有权限
  const noAuthority = [];
  list.forEach((item) => {
    switch (item.type) {
      case 1:
        noAuthority.push(item.msg);
        break;
      case 2:
        noService.push(item.msg);
        break;
      case 3:
        noCheckAccount.push(item.msg);
        break;
      default:
    }
  });
  const content = (
    <div>
      {noCheckAccount.length ? (
        <div>
          <p>以下客户未被授权查账，消息将无法发送至客户！</p>
          <p>（{noCheckAccount.join('、')}）</p>
        </div>
      ) : null}
      {noService.length ? (
        <div>
          <p> 以下客户已被停止服务，消息将无法发送至客户！</p>
          <p>（{noService.join('、')}）</p>
        </div>
      ) : null}
      {noAuthority.length ? (
        <div>
          <p>以下客户不在您的权限下，消息将无法发送至客户！</p>
          <p>（{noAuthority.join('、')}）</p>
        </div>
      ) : null}
    </div>
  );
  ShowConfirm({
    width: 400,
    title: isEdit ? '确定要保存吗？' : '确定要发送吗？',
    content,
    onOk: sendCallback,
  });
};
