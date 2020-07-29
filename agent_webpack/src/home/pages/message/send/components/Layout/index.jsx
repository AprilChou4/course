import React from 'react';
import { connect } from 'nuomi';
import MessageForm from '../MessageForm';
import './index.less';

const Layout = () => {
  return (
    <div styleName="send-message">
      <div styleName="tip-text">消息会发送到客户“授权查账”的账号的诺言端</div>
      <MessageForm messageData={{}} />
    </div>
  );
};

export default connect(({ key }) => ({ key }))(Layout);
