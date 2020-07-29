import React from 'react';
import { Button } from 'antd';
import { SelectList2 } from '@components';

export default class TestSelectList2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedKeys: [],
      dataSource: [],
    };
  }

  componentWillMount() {
    this.getMock();
  }

  getMock = () => {
    const dataSource = [];
    const length = Math.random() * 10000;
    for (let i = 0; i < (length < 1 ? 10 : length); i += 1) {
      dataSource.push({
        key: i.toString(),
        title: `content${i + 1}`,
        description: `description of content${i + 1}`,
        disabled: i % 3 < 1,
      });
    }
    this.setState({
      dataSource,
      selectedKeys: [],
    });
  };

  filterOption = (inputValue, option) => {
    return option.description.indexOf(inputValue) > -1;
  };

  handleSelect = (selectedKeys) => {
    this.setState({
      selectedKeys,
    });
  };

  renderFooter = () => {
    return (
      <Button size="small" style={{ float: 'right', margin: 5 }} onClick={this.getMock}>
        reload
      </Button>
    );
  };

  handleCLick = () => {
    // 修改dataSource的时候一定要同步修改targetKeys和selectedKeys
    this.setState(({ dataSource, selectedKeys }) => {
      const newDataSource = dataSource.filter((item, index) => index > dataSource.length / 2);
      const newDataSourceKeys = newDataSource.map((item) => item.key);
      return {
        dataSource: newDataSource,
        selectedKeys: selectedKeys.filter((val) => newDataSourceKeys.includes(val)),
      };
    });
  };

  render() {
    const { dataSource, selectedKeys } = this.state;
    return (
      <div>
        <Button type="primary" onClick={this.handleCLick}>
          筛选
        </Button>
        <p>(修改dataSource的时候一定要同步修改selectedKeys)</p>
        <SelectList2
          render={(item) => item.title}
          dataSource={dataSource}
          selectedKeys={selectedKeys}
          handleSelect={this.handleSelect}
          footer={this.renderFooter}
          showSearch
          showHeader
          itemsUnit="items"
          itemUnit="item"
          titleText="Source"
          rowHeight={32}
        />
      </div>
    );
  }
}
