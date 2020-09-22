// 报税平台按需加载
import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Bundle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mod: null,
    };
  }

  UNSAFE_componentWillMount() {
    this.load(this.props);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { load } = this.props;
    if (nextProps.load !== load) {
      this.load(nextProps);
    }
  }

  // 更改 load 方法为异步函数
  async load(props) {
    this.setState({
      mod: null,
    });
    // 使用 props.load() 返回的是一个 promise

    const mod = await props.load();
    console.log(mod, '-----mod------');
    this.setState({
      mod: mod.default ? mod.default : mod,
    });
  }

  render() {
    const { mod } = this.state;
    const { children } = this.props;
    return mod ? children(mod) : null;
  }
}
Bundle.propTypes = {
  children: PropTypes.func.isRequired,
  load: PropTypes.func.isRequired,
};

const RouteLoad = (loadComponent, Loading = null) => (props) => {
  console.log(loadComponent, props, '-------props-------');
  return <Bundle load={loadComponent}>{(Comp) => (Comp ? <Comp {...props} /> : Loading)}</Bundle>;
};
export default RouteLoad;
