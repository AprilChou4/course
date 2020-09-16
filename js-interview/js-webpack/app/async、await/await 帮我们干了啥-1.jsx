import React from 'react';
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    function takeLongTime() {
      return new Promise((resolve) => {
        setTimeout(() => resolve('long_time_value'), 1000);
      });
    }
    takeLongTime().then((v) => {
      console.log('got', v);
    });

    // await 命令后面的 Promise 对象，运行结果可能是 rejected，所以最好把 await 命令放在 try...catch 代码块中。
    // async function myFunction() {
    //   try {
    //     await somethingThatReturnsAPromise();
    //   } catch (err) {
    //     console.log(err);
    //   }
    // }

    // // 另一种写法

    // async function myFunction() {
    //   await somethingThatReturnsAPromise().catch(function (err) {
    //     console.log(err);
    //   });
    // }

    async function test1() {
      const res = await takeLongTime();
      console.log(Date.now(), '---before-----');
      console.log('got', res);
      console.log(Date.now(), '---after-----');
    }
    test1();
  }
  //根组件
  render() {
    return (
      <div>
        <p> async 用于申明一个 function 是异步的，而 await 用于等待一个异步方法执行完成。</p>
        <p>await 等到了它要等的东西，一个 Promise 对象，或者其它值，</p>
        <p>如果它等到的不是一个 Promise 对象，那 await 表达式的运算结果就是它等到的东西。</p>
        <p>
          如果它等到的是一个 Promise 对象，await 就忙起来了，它会阻塞后面的代码，等着 Promise 对象
          resolve，然后得到 resolve 的值，作为 await 表达式的运算结果。
        </p>
        <p>
          看到上面的阻塞一词，心慌了吧……放心，这就是 await 必须用在 async 函数中的原因。async
          函数调用不会造成阻塞，它内部所有的阻塞都被封装在一个 Promise 对象中异步执行。
        </p>
      </div>
    );
  }
}

export default App;
