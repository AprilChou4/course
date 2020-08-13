Vue.component('my-component-name', {
  props: ['item'],
  template: '<li>{{item.name}}</li>',
})
const vm = new Vue({
  el: '#app',
  data: {
    message: 'hello,world',
    rawHtml: '<span style="color: red">This should be red.</span>',
    list: [
      {
        name: '张三',
      },
      {
        name: '李四',
      },
      {
        name: '王五',
      },
    ],
  },
  method: {},
})
vm.$watch('message', function (newValue, oldValue) {
  // 这个回调将在 `vm.a` 改变后调用
  console.log(newValue, oldValue, '---newValue, oldValue----')
})
