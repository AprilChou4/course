### 1.Promise 是一个构造函数(大写字母开头，构造函数的江湖规矩),是异步编程的一种解决方案

```
 new Promise(function(resolve,reject){

 })
```

### 2.Promise 构造函数接受一个函数作为参数，该函数的两个参数分别是 resolve 和 reject。 resolve 之后会执行 then，reject 之后会执行 catch。

```
var a = '女神', promise = '我要山盟海誓'
var pro = new Promise(function (resolve, reject) {
    if (a === '女神') {
        resolve(promise)
    } else {
        reject('你不是我的菜')
    }
})

pro
.then(function (data) {
    console.log(data,'----resolve---')
})
.catch(function (data) {
    console.log(data,'-----reject')
})
```

### 3. 或 then 方法可以接受两个回调函数作为参数。第一个回调函数是 Promise 对象的状态变为 resolved 时调用，第二个回调函数是 Promise 对象的状态变为 rejected 时调用。

```
promise.then(function(value) {
  // success
}, function(error) {
  // failure
});

```

4.Promise 新建后就会立即执行。

```
let promise = new Promise(function(resolve, reject) {
  console.log('Promise');
  resolve();
});

promise.then(function() {
  console.log('resolved.');
});

console.log('Hi!');

// Promise
// Hi!
// resolved
```

> - Promise.all()

一个人可以对多个人许诺，聪明的人会懂得将多个许诺凑在一起实现，要凑在一起那就用到 all()，举个栗子:

```
var p1 = new Promise(function(resolve,reject){
    resolve('去泡温泉');
});

var p2 = new Promise(function(resolve,reject){
    resolve('去游泳');
});

Promise.all([p1,p2]).then(function(results){
    console.log(results); // ["去泡温泉", "去游泳"]
})
```

> - Promise.race()

Promise.race()方法同样是将多个 Promise 实例，包装成一个新的 Promise 实例。

```
const p = Promise.race([p1, p2, p3]);
const p = Promise.race([
  fetch('/resource-that-may-take-a-while'),
  new Promise(function (resolve, reject) {
    setTimeout(() => reject(new Error('request timeout')), 5000)
  })
]);

p
.then(console.log)
.catch(console.error);
```

上面代码中，如果 5 秒之内 fetch 方法无法返回结果，变量 p 的状态就会变为 rejected，从而触发 catch 方法指定的回调函数。

> - Promise.reject()

```
const p1 = Promise.reject('出错了');
// 等同于
const p = new Promise((resolve, reject) => reject('出错了'))

p.then(null, function (s) {
  console.log(s,'---')
});
// 出错了
```
