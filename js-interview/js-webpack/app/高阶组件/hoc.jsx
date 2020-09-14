import React from 'react';
import { Button } from 'antd';
const HOC = (InnerComponent) =>
  class extends React.Component {
    constructor() {
      super();
      this.state = {
        count: 0,
      };
    }
    componentWillMount() {
      console.log('HOC will mount');
    }
    componentDidMount() {
      console.log('HOC did mount');
    }
    update() {
      const { count } = this.state;
      this.setState({
        count: count + 1,
      });
    }
    render() {
      const newProps = this.state;
      return <InnerComponent {...this.props} {...newProps} update={this.update.bind(this)} />;
    }
  };
const MyButton = (props) => (
  <Button onClick={props.update}>
    {props.children}-- {props.count}
  </Button>
); //无状态组件
const NewButton = HOC(MyButton); //无状态组件
class Label extends React.Component {
  //传统组件
  componentWillMount() {
    console.log('C will mount');
  }
  componentDidMount() {
    console.log('C did mount');
  }
  render() {
    return (
      <label onClick={this.props.update}>
        {this.props.children}-{this.props.count}
      </label>
    );
  }
}
const LabelHoc = HOC(Label);

class App extends React.Component {
  //根组件
  render() {
    return (
      <div>
        <NewButton>button</NewButton>
        <br />
        <LabelHoc>label</LabelHoc>
      </div>
    );
  }
}

export default App;
