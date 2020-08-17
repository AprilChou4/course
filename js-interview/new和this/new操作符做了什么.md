```
    function Person1(name){
        this.name = name;
    }
    function Person2(name){
        this.name = name;
        return this.name;
    }
    function Person3(name){
        this.name = name;
        return new String(name);
    }
    function Person4 (name){
        this.name = name;
        return function () {
        }
    }
    function Person5(name){
        this.name = name;
        return new Array();
    }
    const person1 = new Person1("yuer");//Person1 {name: "yuer"}

    const person2 = new Person2("yuer");//Person2 {name: "yuer"}

    const person3 = new Person3("yuer");//

    const person4 = new Person4("yuer");//function() {}

    const person5 = new Person5("yuer");//[]
```

这里给出了 5 个例子，其实 new 操作符干了以下三步:

> 1.先创建了一个新的空对象

> 2.设置原型链。然后让这个空对象的 **\_\_proto\_\_** 指向函数的原型 prototype

> 3.让 Func 中的 this 指向 obj，并执行 Func 的函数体。将对象作为函数的 this 传进去，如果 return 出来东西是对象的话就直接返回 return 的内容，没有的话就返回创建的这个对象

> 4、判断 Func 的返回值类型：
> 如果是值类型，返回 obj。如果是引用类型，就返回这个引用类型的对象。

对应伪代码：
var Func=function(){
};
var func=new Func ();
new 干了以下事情

```
//1、创建一个空对象
const obj=new Object();//创建了一个新的空对象o

obj.__proto__= Func.prototype; //设置原型链

var result =Func.call(obj);//让Func中的this指向obj，并执行Func的函数体。

if (typeof(result) == "object"){
  func=result;
}
else{
    func=obj;;
}
```
