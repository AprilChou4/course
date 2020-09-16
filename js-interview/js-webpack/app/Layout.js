import React from 'react';
// async 函数的实现，就是将 Generator 函数和自动执行器，包装在一个函数里。
// async function fn(args) {
//   // ...
// }

// // 等同于

// function fn(args) {
//   return spawn(function* () {
//     // ...
//   });
// }
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    function spawn(genF) {
      return new Promise(function (resolve, reject) {
        var gen = genF();
        function step(nextF) {
          try {
            var next = nextF();
          } catch (e) {
            return reject(e);
          }
          if (next.done) {
            return resolve(next.value);
          }
          Promise.resolve(next.value).then(
            function (v) {
              step(function () {
                return gen.next(v);
              });
            },
            function (e) {
              step(function () {
                return gen.throw(e);
              });
            },
          );
        }
        step(function () {
          return gen.next(undefined);
        });
      });
    }
  }
  //根组件
  render() {
    return <div>11</div>;
  }
}

export default App;
