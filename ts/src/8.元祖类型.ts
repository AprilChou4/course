//标注语法=> 变量:[类型1，类型2，...]
// 1.初始化数据的个数以及对应位置标注类型必须一致
// 2.越界数据必须是元组标注中的类型之一（标注越界数据可以不用对应顺序，联合类型）
// 3.未开启strictNullChecks:true会使用undefined进行初始化
// 1------
// let data1: [string, number] = ["king", 1, 4]; //error 不符合2
// let data2: [string, number] = [2, 1]; //error 不符合1

// let data3: [string, number] = ["king", 1]; //correct
// data3.push("king"); //correct
// data3.push(2); //correct
// data3.push(true); //error
