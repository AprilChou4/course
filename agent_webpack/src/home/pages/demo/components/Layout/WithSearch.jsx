import React, { Component } from 'react';
import { Tree, Button, Input } from 'antd';
import { withSearch } from '@components';

const { TreeNode } = Tree;

const treeData = [
  {
    title: '0-0',
    key: '0-0',
    children: [
      {
        title: '0-0-0',
        key: '0-0-0',
        children: [
          { title: '0-0-0-0', key: '0-0-0-0' },
          { title: '0-0-0-1', key: '0-0-0-1' },
          { title: '0-0-0-2', key: '0-0-0-2' },
        ],
      },
      {
        title: '0-0-1',
        key: '0-0-1',
        children: [
          { title: '0-0-1-0', key: '0-0-1-0' },
          { title: '0-0-1-1', key: '0-0-1-1' },
          { title: '0-0-1-2', key: '0-0-1-2' },
        ],
      },
      {
        title: '0-0-2',
        key: '0-0-2',
      },
      {
        title: '0-0-3',
        key: '0-0-3',
      },
      {
        title: '0-0-4',
        key: '0-0-4',
      },
      {
        title: '0-0-5',
        key: '0-0-5',
      },
      {
        title: '0-0-6',
        key: '0-0-6',
      },
      {
        title: '0-0-7',
        key: '0-0-7',
      },
    ],
  },
];

@withSearch({
  style: {
    width: 500,
    height: 500,
  },
  onCheckedAllChange(e, prop) {
    // prop.setState({})
  },
  search(prop) {
    return <Input.Search />;
  },
  footer(prop) {
    const onClick = () => {
      prop.setCheckedAllStatus('2');
    };
    return (
      <Button size="small" style={{ float: 'right', margin: 5 }} onClick={onClick}>
        halfCheck
      </Button>
    );
  },
})
class TestWithSearch extends Component {
  state = {
    checkedKeys: ['0-0'],
    selectedKeys: ['0-0'],
  };

  onCheck = (checkedKeys) => {
    this.setState({ checkedKeys, selectedKeys: checkedKeys });
  };

  renderTreeNodes = (data) =>
    data.map((item) => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode {...item} />;
    });

  render() {
    const { checkedKeys, selectedKeys } = this.state;

    return (
      <Tree
        checkable
        blockNode
        defaultExpandAll
        checkedKeys={checkedKeys}
        selectedKeys={selectedKeys}
        onCheck={this.onCheck}
        onSelect={this.onCheck}
      >
        {this.renderTreeNodes(treeData)}
      </Tree>
    );
  }
}

export default TestWithSearch;
