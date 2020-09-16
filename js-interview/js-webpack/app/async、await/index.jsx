import React from 'react';
import { Button } from 'antd';
//   await 等到了它要等的东西，一个 Promise 对象，或者其它值，
//   如果它等到的不是一个 Promise 对象，那 await 表达式的运算结果就是它等到的东西。
//   如果它等到的是一个 Promise 对象，await 就忙起来了，它会阻塞后面的代码，等着 Promise 对象 resolve，然后得到 resolve 的值，作为 await 表达式的运算结果。

//   看到上面的阻塞一词，心慌了吧……放心，这就是 await 必须用在 async 函数中的原因。async 函数调用不会造成阻塞，它内部所有的阻塞都被封装在一个 Promise 对象中异步执行。
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    function getSomething() {
      return 'something';
    }

    function testAsync(x) {
      const p = new Promise((resolve, reject) => {
        if (x === 1) {
          resolve('成功');
        } else {
          reject('失败了！');
        }
      });
      console.log(2222, '我还会执行嘛~~~');
      return p;
      // return Promise.resolve('hello async');
    }

    async function test() {
      const v1 = getSomething();
      const v2 = await testAsync(1);
      const v3 = await '我是v3';
      console.log(v1, v2, v3);
    }

    test();

    //   function takeLongTime() {
    //   return new Promise((resolve) => {
    //     setTimeout(() => resolve('long_time_value'), 1000);
    //   });
    // }

    // const res = await takeLongTime();
    // console.log(Date.now(), '---before-----');
    // console.log('got', res);
    // console.log(Date.now(), '---after-----');
  }
  //根组件
  render() {
    return <div>1111</div>;
  }
}

export default App;
