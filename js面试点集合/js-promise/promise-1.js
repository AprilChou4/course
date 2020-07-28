// 手写promise
class Promise {
  constructor(excutor) {
    this.value = ''
    this.reason = ''
    this.status = 'padding'
    this.onFulfilledCallback = []
    this.onRejectedCallback = []
    let resolve = (value) => {
      /*2.这个判断是为了status不可逆 只能从 padding转化为 成功或者失败*/
      if (this.status == 'padding') {
        this.status = 'fulfilled'
        this.value = value
        /*3.当转态改变的时候依次执行队列里面储存的then函数里面对应的回调*/
        this.onFulfilledCallback.forEach((fn) => {
          fn()
        })
      }
    }
    let reject = (reason) => {
      /*2.这个判断是为了status不可逆 只能从 padding转化为 成功或者失败*/
      if (this.status == 'padding') {
        this.status = 'rejected'
        this.reason = reason
        /*3.当转态改变的时候依次执行队列里面储存的then函数里面对应的回调*/
        this.onRejectedCallback.forEach((fn) => {
          fn()
        })
      }
    }
    /*1. 当发生异常是捕获异常 */
    try {
      excutor(resolve, reject)
    } catch (e) {
      reject(e)
    }
  }
  then(onFulfilled, onRejected) {
    //4.防止使用者不传成功或失败回调函数，所以成功失败回调都给了默认回调函数
    onFulfilled =
      typeof onFulfilled === 'function' ? onFulfilled : (value) => value
    onRejected =
      typeof onRejected === 'function'
        ? onRejected
        : (error) => {
            throw error
          }
    let newPromise
    if (this.status == 'fulfilled') {
      return (newPromise = new Promise((resolve, reject) => {
        setTimeout(() => {
          try {
            let x = onFulfilled(this.value)
            this.resolvePromise(newPromise, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        })
      }))
    }
    if (this.status == 'rejected') {
      return (newPromise = new Promise((resolve, reject) => {
        setTimeout(() => {
          try {
            let x = onRejected(this.reason)
            this.resolvePromise(newPromise, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        })
      }))
    }
    if (this.status == 'padding') {
      return (newPromise = new Promise((resolve, reject) => {
        /*3.当excutor为异步的时候先把then方法里面的回调储存在失败或者成功的队列里面*/
        this.onFulfilledCallback.push(() => {
          //这里可以写其他的代码对resolve做一层封装todo
          setTimeout(() => {
            try {
              let x = onFulfilled(this.value)
              this.resolvePromise(newPromise, x, resolve, reject)
            } catch (e) {
              reject(e)
            }
          })
        })
        this.onRejectedCallback.push(() => {
          setTimeout(() => {
            try {
              let x = onRejected(this.reason)
              this.resolvePromise(newPromise, x, resolve, reject)
            } catch (e) {
              reject(e)
            }
          })
        })
      }))
    }
    //4.保证链式调用 返回this  这样做虽然能链式调用但是 所有链式调用的回调函数都挂载到同一个对象上 且当后面的then方法执行
    //的时候promise的状态已经确定会马上执行其对应的回调，并且参数都为this.value这一个值
    //return this
  }
  catch(onRejected) {
    this.then(null, onRejected)
  }
  resolvePromise(newPromise, x, resolve, reject) {
    //2.3.1规范，避免循环引用
    if (newPromise === x) {
      return reject(new TypeError('Circular reference'))
    }
    //called变量主要是用来判断如果resolvePromise函数已经resolve或者reject了，那就不需要在执行下面的resolce或者reject。
    //设置一个标志位，在执行resolve或者reject其中之一后，讲不能再执行resolve或者reject  eg:resolve();reject()
    let called = false
    if (x != null && (typeof x === 'object' || typeof x === 'function')) {
      try {
        let then = x.then
        if (typeof then === 'function') {
          //2.3.3.3 如果 then 是一个函数，以x为this调用then函数，且第一个参数是resolve，第二个参数是reject
          then.call(
            x,
            (y) => {
              if (called) return
              called = true
              this.resolvePromise(newPromise, y, resolve, reject)
            },
            (error) => {
              if (called) return
              called = true
              reject(error)
            }
          )
        } else {
          //2.3.3.4 如果 then不是一个函数，则 以x为值fulfill promise。
          resolve(x)
        }
      } catch (e) {
        if (called) return
        called = true
        reject(e)
      }
    } else {
      resolve(x)
    }
  }
}
// 执行测试用例需要用到的代码
Promise.deferred = function () {
  let defer = {}
  defer.promise = new Promise((resolve, reject) => {
    defer.resolve = resolve
    defer.reject = reject
  })
  return defer
}
try {
  module.exports = Promise
} catch (e) {}

// 1.npm i -g promises-aplus-tests
// 2.promises-aplus-tests mypromise.js
