// js继承的6种方式
// 想要继承，就必须要提供个父类（继承谁，提供继承的属性）
// 父类
function Person(name) {
  this.name = name;
  this.sum = function () {
    alert(this.name);
  };
}

Person.prototype.age = 17; //给构造函数添加原型属性

// 1.原型链继承
function Per() {
  this.name = "king";
}
Per.prototype = new Person();
var per1 = new Per();
console.log(per1.age);
console.log(per1 instanceof Person);
// 　重点：让新实例的原型等于父类的实例。
// 　　　　特点：1、实例可继承的属性有：实例的构造函数的属性，父类构造函数属性，父类原型的属性。（新实例不会继承父类实例的属性！）
// 　　　　缺点：1、新实例无法向父类构造函数传参。
// 　　　　　　　2、继承单一。
// 　　　　　　　3、所有新实例都会共享父类实例的属性。（原型上的属性是共享的，一个实例修改了原型属性，另一个实例的原型属性也会被修改！）

// 2.借用构造函数继承
function Con() {
  Person.call(this, "jer");
  this.age = 12;
}

const con1 = new Con();
console.log(con1.name);
console.log(con1.age);
console.log(con1 instanceof Person);

// 重点：用.call()和.apply()将父类构造函数引入子类函数（在子类函数中做了父类函数的自执行（复制））
// 　　　　特点：1、只继承了父类构造函数的属性，没有继承父类原型的属性。
// 　　　　　　　2、解决了原型链继承缺点1、2、3。
// 　　　　　　　3、可以继承多个构造函数属性（call多个）。
// 　　　　　　　4、在子实例中可向父实例传参。
// 　　　　缺点：1、只能继承父类构造函数的属性。
// 　　　　　　　2、无法实现构造函数的复用。（每次用每次都要重新调用）
// 　　　　　　　3、每个新实例都有父类构造函数的副本，臃肿。

// 3.组合继承
function SubType(name) {
  Person.call(this, name);
}
SubType.prototype = new Person();
const sub = new SubType("gar");
console.log(sub.name);
console.log(sub instanceof Person);
