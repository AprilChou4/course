// 1-----
// let obj1: Object = {
//   x: 1,
//   y: 2,
// };

// // obj1.x; //报错

// // 正确
// obj1.toString();

// // 2------
// // 标注真正的对象类型:基于对象字面量的类型标注
// let obj2: { x: number; y: number } = {
//   x: 1,
//   y: 2,
// };

// obj2.x;
// obj2.y;

// 3---------
// 内置对象类型
let d1: Date = new Date();
d1.getTime();
