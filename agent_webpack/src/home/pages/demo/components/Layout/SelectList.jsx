import React from 'react';
import { Button, Input } from 'antd';
import { SelectList } from '@components';

const treeData = [
  {
    title: '10-0',
    key: '10-0',
    children: [
      {
        title: '10-0-0',
        key: '10-0-0',
        children: [
          { title: '10-0-0-0', key: '10-0-0-0' },
          { title: '10-0-0-1', key: '10-0-0-1' },
          { title: '10-0-0-2', key: '10-0-0-2' },
        ],
      },
      {
        title: '10-0-1',
        key: '10-0-1',
        children: [
          { title: '10-0-1-0', key: '10-0-1-0' },
          { title: '10-0-1-1', key: '10-0-1-1' },
          { title: '10-0-1-2', key: '10-0-1-2' },
        ],
      },
      {
        title: '10-0-2',
        key: '10-0-2',
      },
    ],
  },
  {
    title: '10-1',
    key: '10-1',
    children: [
      { title: '10-1-0-0', key: '10-1-0-0' },
      { title: '10-1-0-1', key: '10-1-0-1' },
      { title: '10-1-0-2', key: '10-1-0-2' },
    ],
  },
  {
    title: '10-2',
    key: '10-2',
  },
];

export default () => {
  const onSelect = (selectedKeys, e) => {
    console.log(selectedKeys, e, 'onSelect');
  };
  const onCheck = (checkedKeys, e) => {
    console.log(checkedKeys, e, 'onCheck');
  };
  return (
    <SelectList
      // checkable
      title="标题啊啊啊"
      dataSource={treeData}
      onSelect={onSelect}
      onCheck={onCheck}
      getTreeNodeProps={(record) => ({
        selectable: !record.children,
      })}
      search={(prop) => <Input.Search />}
      footer={(prop) => {
        return (
          <Button size="small" style={{ float: 'right', margin: 5 }}>
            halfCheck
          </Button>
        );
      }}
      style={{ width: 500, height: 500 }}
    />
  );
};
