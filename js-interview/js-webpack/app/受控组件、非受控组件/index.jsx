import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class Sum extends Component {
  handleChange(event) {
    console.log(this.a);
    let a = parseInt(this.a.value || 0);
    let b = parseInt(this.b.value || 0);
    this.result.value = a + b;
  }
  render() {
    //如果ref等于一个函数，表示当元素被挂载到页面中之后会立即调用此函数，并传入渲染后的DOM元素
    return (
      //经过React封装可以onChange可以写在div上
      <div onChange={this.handleChange.bind(this)}>
        <input
          type="text"
          ref={(ref) => {
            this.a = ref;
          }}
        />
        +
        <input
          type="text"
          ref={(ref) => {
            this.b = ref;
          }}
        />
        =
        <input
          type="text"
          ref={(ref) => {
            this.result = ref;
          }}
        />
      </div>
      //this指当前类的实例,a表示当前实例的属性，此时this.a就是input这个DOM元素
      //input是非受控组件，因为不受状态控制
    );
  }
}
export default Sum;
