import React from 'react';
import { Icon, Button } from 'antd';

import './transferOperation.less';

function TransferOperation({ operations, disabled, toLeft, toRight }) {
  return (
    <div styleName="transfer-operation">
      <Button disabled={disabled[0]} type="primary" onClick={toRight}>
        {operations[0]}
        <Icon type="right" />
      </Button>
      <Button type="primary" disabled={disabled[1]} onClick={toLeft}>
        <Icon type="left" />
        {operations[1]}
      </Button>
    </div>
  );
}

export default TransferOperation;
