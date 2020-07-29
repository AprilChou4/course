// 只做一件事，把`WrappedComponent`回传个`getInstance`（如果有的话）
import React, { Component } from 'react';

function getDisplayName(component) {
  return component.displayName || component.name || 'Component';
}
export default (WrappedComponent) => {
  return class withRef extends Component {
    static displayName = `withRef(${getDisplayName(WrappedComponent)})`;

    // 在高阶组件包裹后，保留组件原有名称
    render() {
      // 这里重新定义一个props的原因是:
      // 你直接去修改this.props.ref在react开发模式下会报错，不允许你去修改
      const props = {
        ...this.props,
      };
      // 在这里把getInstance赋值给ref，
      // 传给`WrappedComponent`，这样就getInstance能获取到`WrappedComponent`实例
      const { getInstance, ref } = this.props;
      props.ref = (el) => {
        getInstance && getInstance(el);
        ref && ref(el);
      };
      return <WrappedComponent {...props} />;
    }
  };
};
