import React, { useState } from 'react';
import { Button, Input } from 'antd';
import MyInput from './中文不能输入/MyInput';
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
    };
  }
  informParentChange = (v) => {
    this.setState({
      value: v,
    });
  };
  //根组件
  render() {
    const { value } = this.state;
    return <MyInput value={value} onInputChange={this.informParentChange} />;
  }
}

export default App;
