import React, { Component } from 'react';
import { Input, Icon, Button } from 'antd';
import { TableTransfer } from '@components';

const mockData = [];
for (let i = 0; i < 200; i += 1) {
  mockData.push({
    key: i.toString(),
    name: `content${i + 1}`,
    disabled: i % 4 === 0,
  });
}
const columns = [
  {
    dataIndex: 'name',
    title: '名称',
  },
];

export default class TestTableTransfer extends Component {
  state = {
    targetKeys: ['0', '1', '2'],
  };

  handleChange = (nextTargetKeys) => {
    this.setState({ targetKeys: nextTargetKeys });
  };

  render() {
    const { targetKeys } = this.state;
    return (
      <TableTransfer
        tableOptions={{ columns }}
        dataSource={mockData}
        targetKeys={targetKeys}
        onChange={this.handleChange}
        filterOption={(inputValue, item) => item.title.includes(inputValue)}
        listStyle={{
          width: 250,
          height: 500,
        }}
        locale={{
          itemUnit: '',
          itemsUnit: '',
        }}
        customSearch={
          <Input prefix={<Icon type="search" />} suffix={<Button type="link">更多条件</Button>} />
        }
      />
    );
  }
}
