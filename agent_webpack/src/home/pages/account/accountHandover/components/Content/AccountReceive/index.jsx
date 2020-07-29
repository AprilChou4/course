import React from 'react';
import ToReceive from './ToReceive';
import HistoricalReception from './HistoricalReception';
import '../style.less';

const AccountReceive = () => {
  return (
    <div styleName="main">
      <div styleName="item">
        <ToReceive />
      </div>
      <div styleName="item">
        <HistoricalReception />
      </div>
    </div>
  );
};

export default AccountReceive;
