// JS中宏任务与微任务执行顺序

function testSometing() {
  console.log("testSometing function"); //3
  return "testSometing return"; //6
}
async function testAsync() {
  console.log("testAsync function"); //7
  return Promise.resolve("testAsync promise");
}
async function test() {
  console.log("test function"); //2
  const v1 = await testSometing();
  console.log(v1);
  const v2 = await testAsync();
  new Promise(function (resolve, reject) {
    console.log("promise2");
    resolve();
  }).then(function () {
    console.log("promise2 then");
  });
  console.log(v2);
  console.log(v1, v2);
}
console.log("start"); //1
test();
var promise = new Promise((resolve) => {
  console.log("promise"); //4
  resolve("promise then"); //8
});
promise.then((val) => {
  console.log(val);
});
console.log("end"); //5
//start->test function->testSometing function->promise->
//end->testSometing return ->testAsync function->promise then ->promise2->testAsync promise
//->testSometing return testAsync promise -> promise2 then
