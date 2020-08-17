### JavaScript 中 call()、apply()、bind() 的用法

**apply 是个异类，参数接收数组**

```
const name='king';
const age='18';
const obj={
    name:'小张',
    objAge:this.age,
    myFun:function(from,to){
        console.log(this.name+'年龄'+this.age,'来自'+from+'去往'+to)
    }
}
const db={
    name:'德玛',
    age:99
}
obj.myFun.call(db,'成都','上海');　　　 // 德玛 年龄 99  来自 成都去往上海
obj.myFun.apply(db,['成都','上海']);      // 德玛 年龄 99  来自 成都去往上海
obj.myFun.bind(db,'成都','上海')();       // 德玛 年龄 99  来自 成都去往上海
obj.myFun.bind(db,['成都','上海'])();　　 // 德玛 年龄 99  来自 成都, 上海去往undefined
obj.myFun.bind(db,['成都','上海'])('宁波');　　 // 德玛 年龄 99  来自 成都, 上海去往宁波
```

call 、bind 、 apply 这三个函数的第一个参数都是 this 的指向对象，第二个参数差别就来了：

> call 的参数是直接放进去的，第二第三第 n 个参数全都用逗号分隔，直接放到后面 obj.myFun.call(db,'成都', ... ,'string' )。

> apply 的所有参数都必须放在一个数组里面传进去 obj.myFun.apply(db,['成都', ..., 'string' ])。

> bind 除了返回是函数以外，它的参数和 call 一样。

当然，三者的参数不限定是 string 类型，允许是各种类型，包括函数 、 object 等等！
