import React from 'react';
import { Button } from 'antd';
import { Transfer } from '@components';

export default class TestTransferList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedKeys: [],
      targetKeys: [],
      dataSource: [],
    };
  }

  componentDidMount() {
    this.getMock();
  }

  getMock = () => {
    const dataSource = [];
    const targetKeys = [];
    const selectedKeys = [];
    const length = 10000;
    for (let i = 0; i < (length < 1 ? 10 : length); i += 1) {
      const data = {
        key: i.toString(),
        title: `content${i + 1}`,
        description: `description of content${i + 1}`,
        disabled: i % 3 < 1,
        chosen: Math.random() * 2 > 1,
        selected: Math.random() * 2 > 1,
      };
      if (data.chosen) {
        targetKeys.push(data.key);
      }
      if (data.selected) {
        selectedKeys.push(data.key);
      }
      dataSource.push(data);
    }

    this.setState({
      dataSource,
      targetKeys,
      selectedKeys,
    });
  };

  filterOption = (inputValue, option) => {
    return option.description.indexOf(inputValue) > -1;
  };

  handleChange = (nextTargetKeys, _direction, _moveKeys) => {
    this.setState({ targetKeys: nextTargetKeys });
  };

  handleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    this.setState({ selectedKeys: [...sourceSelectedKeys, ...targetSelectedKeys] });
  };

  handleCLick = () => {
    // 修改dataSource的时候一定要同步修改targetKeys和selectedKeys
    this.setState(({ dataSource, targetKeys, selectedKeys }) => {
      const newDataSource = dataSource.filter((item, index) => index > dataSource.length / 2);
      const newDataSourceKeys = newDataSource.map((item) => item.key);
      return {
        dataSource: newDataSource,
        targetKeys: targetKeys.filter((val) => newDataSourceKeys.includes(val)),
        selectedKeys: selectedKeys.filter((val) => newDataSourceKeys.includes(val)),
      };
    });
  };

  render() {
    const { dataSource, targetKeys, selectedKeys } = this.state;

    return (
      <div>
        <Button type="primary" onClick={this.handleCLick}>
          筛选
        </Button>
        <p>(修改dataSource的时候一定要同步修改targetKeys和selectedKeys)</p>
        <Transfer
          render={(item) => `${item.title}-${item.description}`}
          dataSource={dataSource}
          targetKeys={targetKeys}
          selectedKeys={selectedKeys}
          onSelectChange={this.handleSelectChange}
          filterOption={this.filterOption}
          onChange={this.handleChange}
          titles={['source', 'target']}
          className="test"
          rowHeight={32}
          listStyle={{
            width: '40%',
            height: 400,
          }}
          operations={['to right', 'to left']}
          showSearch
          notFoundContent="not found"
          searchPlaceholder="Search"
        />
      </div>
    );
  }
}
