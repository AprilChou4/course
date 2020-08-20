//==== 无值类型====
// 表示没有任何类型，通常用于标注无返回值的函数的返回值类型,函数默认标注类型为：void

//1------------
// 可以看出函数默认类型void
// function fn(){}
// fn();

// function fn(): void {
//   // 没有return
// }

// function fn(): number {
//   return 1;
// }

// ====Never类型======
// 1-----------
// 当一个函数永远不可能执行return的时候，返回的就是never，与void不同，void是执行了return，只是没有值；never是不会执行return，比如抛出错误，导致函数终止执行

// function fn(): never {
//   throw new Error("error");
// }

// 2----------
// never类型是所有其他类型的子类
// 如
// function fn(): never {
//   throw new Error("error");
// }
// let a: string;
// a = fn();

// // 3--------------
// // 其他类型不能赋值给never类型，即使是any
// let b: never;
// b = "king"; //error
// let c: any;
// b = c; //error

//=======任意类型====
// 有的时候，我们并不确定政治到底是什么类型或者不需要对该值进行类型检测，就可以标注为any类型
// 1.任何值都可以赋值给any类型
// 2.any类型也可以赋值给任意类型
// 3.any类型有任意属性和方法
// 标注语法=> 变量:any
// 注意：标注为any类型，也意味着放弃对该值的类型检测，同时也放弃了ide的智能提示
// tip:指定noImplicitAny:true

// ======未知类型=====
// unknow,3.0版本中新增，属于安全版的any，但是与any不同的是：
// 1.unknow仅能赋值unknow、any
// 2.unknow没有任何属性和方法
// 标注语法=> 变量:unknow
// let a: any;
// a.indexOf(); //correct
// let b: unknown;
// b.indexOf(); //error
