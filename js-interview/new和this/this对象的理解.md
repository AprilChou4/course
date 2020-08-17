this 的指向

this 表示当前对象，this 的指向是根据调用的上下文来决定的，默认指向 window 对象，指向 window 对象时可以省略不写

### 5 种指向

> 1.指向 window 对象即全局对象

在全局作用域下，this 指向全局对象。在浏览器中全局对象就是 window 对象

```
    function test() {
        console.log(this)
    }
    test() //window
```

> 2.指向最近的对象或声明的对象

当 this 关键字在一个声明对象内部使用，其值会被绑定到调用该 this 的函数的最近的父对象

```
var person = {
    first: 'John',
    last: 'Smith',
    full: function() {
        console.log(this.first + ' ' + this.last);
    },
    personTwo: {
        first: 'Allison',
        last: 'Jones',
        full: function() {
            console.log(this.first + ' ' + this.last);
        }
    }
};
person.full(); // John Smith
person.personTwo.full(); // Allison Jones
```

> 3.new 实例化时指向实例化对象

当使用 new 关键字构建一个新的对象，this 会绑定到这个新对象

```
function Animal(name){
    this.name = name;
    console.log(this); //Animal {name: "cat"}
    console.log(this.name);
}
var cat = new Animal('cat'); //Animal {name: "cat"}
var dog = new Animal('dog'); //Animal {name: "dog"}
```

> 4.call/apply/bind 指向第一个参数对象

```
function add(c, d) {
 console.log(this.a + this.b + c + d);
}
add(3,4); //

// 延伸一下
a + b + 2 // error  a/b 未定义 会报错
//this.a + this.b + 2 // NaN ，undefined 则不会报错
//说明 undefined + 2 == NaN

var  ten = {a: 1, b: 2}
add.call(ten, 3, 4) //10
add.apply(ten, [3, 4]) //10

// bind 场景
var small = {
 a: 1,
 go: function(b,c,d){
  console.log(this.a+b+c+d);
 }
}
var large = {
 a: 100
}

var bindTest = small.go.bind(large, 1, 2, 3)
bindTest()

// 还有一种写法
var bindTest = small.go.bind(large, 1) //已知部分参数
bindTest(2, 3) //剩余参数追加

small.go.bind(large, 1)(2,3)
```

> 5.es6 中箭头函数中的 this 对象

    定义到对象属性方法中，指向 window
    定义在原型链上的 this，指向 window
    定义在构造函数中，会报错
    定义在事件函数中，指向 window

```
let names = 'window-names'; //改为var
const obj = {
   name: 'es6',
    say: () => {
        console.log(this === window)
        console.log(this.names)
    }
}
obj.say() //true

// 原型链上
 Cat.prototype.sayName = () => {
    console.log(this === window)
    return this.name
  }
  const cat = new Cat('mm');
  cat.sayName()
  // true     this为window
  // ""  window.name 为空

  // 解决方法 ===> sayName 更改成普通函数

  function Cat(name) {
    this.name = name;
  }
  Cat.prototype.sayName = function () {
    console.log(this === ff)
    return this.name
  }
  const ff = new Cat('ff');
  ff.sayName();
// 事件函数 箭头函数在声明的时候就绑定了它的上下文环境，要动态改变上下文是不可能的。
const button = document.getElementById('mngb');
  button.addEventListener('click', ()=> {
    console.log(this === window) // true
    this.innerHTML = 'clicked button'
  })
  // 其实我们是要this执行被点击的button
  // 解决方法 --> 回调函数用普通函数
  const button = document.getElementById('mngb');
  button.addEventListener('click', function(e){
    console.log(this === button)
    console.log(e.target)
    this.innerHTML = 'clicked button'
  })
```
