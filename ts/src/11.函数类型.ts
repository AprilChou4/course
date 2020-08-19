// ======函数类型=====
// 在JavaScript中函数是一等公民的存在，在typeScript也是如此，函数也有自己的类型标注格式
// 标注格式=> 函数名称(参数1:类型,参数2:类型,...):返回值类型;

function add(a: number, b: number): number {
  return a + b;
}

function foreach(data: string[], callback: (a: number, b: string) => void) {
  for (let i: number = 0; i < data.length; i++) {
    callback(i, data[i]);
  }
}

let arr: string[] = ["a", "b", "c"];
foreach(arr, function (k, v) {});
