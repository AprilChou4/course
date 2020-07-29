import React from 'react';
import AccountTable from '../table';
import TableFilter from '../filter';

import './style.less';

const Layout = () => {
  return (
    <div styleName="staff-performance-container">
      <TableFilter />
      <AccountTable />
    </div>
  );
};

export default Layout;
