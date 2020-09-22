import React, { Component } from 'react';
import { HashRouter as Router, Link, Route, Switch, Redirect, withRouter } from 'react-router-dom';

class App extends Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    const { type } = nextProps;
    // console.log(type, prevState, '----type--constructor----');
    // 当传入的type发生变化的时候，更新state
    if (type !== prevState.type) {
      return {
        type,
      };
    }
    // 否则，对于state不进行任何操作
    return null;
  }
  constructor(props) {
    super(props);
    this.state = {
      type: 'ccc',
    };
  }
  render() {
    // console.log(this.state.type, '------type-------');
    return <div className="App">{this.props.children}</div>;
  }
}

export default App;
