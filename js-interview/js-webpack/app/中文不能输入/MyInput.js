import React from 'react';
import { Button, Input } from 'antd';
// input update 中文输入有问题

class MyInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOnComposition: false,
      myValue: props.value || '',
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { value } = this.props;
    if (nextProps.value !== value) {
      this.setState({
        myValue: nextProps.value,
      });
    }
  }

  handleComposition = (e) => {
    const { value } = e.target;

    console.log(`${e.type}: ${e.target.value}`, 'value', value);
    if (e.type === 'compositionend') {
      // composition is end
      this.setState({ isOnComposition: false }, () => {
        this.handleFixedChange(value);
      });
    } else {
      // in composition
      this.setState({ isOnComposition: true }, () => {
        this.setState({
          myValue: value,
        });
      });
    }
  };

  handleFixedChange = (inputValue) => {
    const { isOnComposition } = this.state;
    const { onInputChange } = this.props;
    console.log(isOnComposition, '-----isOnComposition');
    console.log(`${'onChange' + ': '}${inputValue}`);
    this.setState({
      myValue: inputValue,
    });
    // 保存value
    onInputChange(inputValue);
  };

  // 根组件
  render() {
    const { myValue } = this.state;
    const { value, ...newProps } = this.props;
    return (
      <Input
        onChange={(e) => this.handleFixedChange(e.target.value)}
        onCompositionStart={this.handleComposition}
        onCompositionUpdate={this.handleComposition}
        onCompositionEnd={this.handleComposition}
        {...newProps}
        // value={this.props.value}
        value={myValue}
      />
    );
  }
}

export default MyInput;
