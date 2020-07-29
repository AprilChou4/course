import React from 'react';
import { Tabs } from 'antd';
// import { InputLimit, TextAreaLimit } from '@components/InputLimit';
import InputLimit from './InputLimit';
import SearchInput from './SearchInput';
import More from '../More';
import FormTable from './FormTable';

import Transfer from './Transfer';
import SelectList from './SelectList';
import TableTransfer from './TableTransfer';
import WithSearch from './WithSearch';
import './style.less';

const { TabPane } = Tabs;
const TabPanes = [
  {
    title: 'InputLimit',
    content: <InputLimit />,
  },
  {
    title: 'More',
    content: <More />,
  },
  {
    title: 'SearchInput',
    content: <SearchInput />,
  },
  {
    title: 'Transfer',
    content: <Transfer />,
  },
  {
    title: 'SelectList',
    content: <SelectList />,
  },
  {
    title: 'TableTransfer',
    content: <TableTransfer />,
  },
  {
    title: 'WithSearch',
    content: <WithSearch />,
  },
  {
    title: 'FormTable',
    content: <FormTable />,
  },
];

const Layout = () => {
  // document.getElementById('globalLoading').remove();
  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>组件demo</h1>

      <Tabs
        tabPosition="left"
        defaultActiveKey="7"
        style={{ width: '800px' }}
        className="m-demoTab"
      >
        {TabPanes.map((item, index) => (
          <TabPane tab={item.title} key={String(index)}>
            {item.content}
          </TabPane>
        ))}
      </Tabs>
    </div>
  );
};

export default Layout;
