import React from 'react';
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    /**
     * 传入参数 n，表示这个函数执行的时间（毫秒）
     * 执行的结果是 n + 200，这个值将用于下一步骤
     */
    function takeLongTime(n) {
      return new Promise((resolve) => {
        // resolve(n + 200);
        setTimeout(() => resolve(n + 200), n);
      });
    }

    function step1(n) {
      console.log(`step1 with ${n}`);
      return takeLongTime(n);
    }

    function step2(m, n) {
      console.log(`step2 with ${m} and ${n}`);
      return takeLongTime(m + n);
    }

    function step3(k, m, n) {
      console.log(`step3 with ${k}, ${m} and ${n}`);
      return takeLongTime(k + m + n);
    }

    // promise 实现 那一堆参数处理，就是 Promise 方案的死穴—— 参数传递太麻烦了，看着就晕！

    function doIt() {
      console.time('doIt');
      const time1 = 300;
      step1(time1)
        .then((time2) => {
          return step2(time1, time2).then((time3) => [time1, time2, time3]);
        })
        .then((times) => {
          console.log(times, '--times');
          const [time1, time2, time3] = times;
          return step3(time1, time2, time3);
        })
        .then((result) => {
          console.log(`result is ${result}`);
          console.timeEnd('doIt');
        });
    }

    doIt();

    // // 结果和之前的 Promise 实现是一样的，但是这个代码看起来是不是清晰得多，几乎跟同步代码一样
    // async function doItAsync() {
    //   console.time('doIt');
    //   const time1 = 300;
    //   const time2 = await step1(time1);
    //   const time3 = await step2(time1, time2);
    //   const result = await step3(time1, time2, time3);
    //   console.log(`result is ${result}`);
    //   console.timeEnd('doIt');
    // }

    // doItAsync();
  }
  //根组件
  render() {
    return (
      <div>
        单一的 Promise 链并不能发现 async/await 的优势，但是，如果需要处理由多个 Promise 组成的 then
        链的时候，优势就能体现出来了（很有意思，Promise 通过 then 链来解决多层回调的问题，现在又用
        async/await 来进一步优化它）。
        <p>
          假设一个业务，分多个步骤完成，每个步骤都是异步的，而且依赖于上一个步骤的结果。我们仍然用
          setTimeout 来模拟异步操作：
        </p>
      </div>
    );
  }
}

export default App;
