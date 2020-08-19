// 1---
// let un: undefined;
// let nul: null;
// let isOks: boolean = true;
// isOks = undefined;
// isOks = null;

// 2----
// 其他类型可以赋值为null和undefined；但是null和undefined不能赋值为其他类型
// let a: string = "king";
// a = null;
// a = undefined;

// 3-----
// let b; //默认类型为any 值为undefined

// let c: null = null;
// c.b; //报错

// 4--------
// ele 有可能是null； 开启strictNullChecks:true,可以排查风险
// let ele = document.querySelector(".box");
// ele.id;
// ele?.id;
// if (ele) {
//   ele.id;
// }
