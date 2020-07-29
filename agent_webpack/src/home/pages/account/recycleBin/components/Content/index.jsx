import React from 'react';
import Header from './Header';
import DataGrid from './DataGrid';
import './style.less';

function AccountTransfer() {
  return (
    <div styleName="main">
      <div styleName="header">
        <Header />
      </div>
      <div styleName="content">
        <DataGrid />
      </div>
    </div>
  );
}

export default AccountTransfer;
