[使用 Jest 测试 JavaScript (入门篇)](https://www.jianshu.com/p/70a4f026a0f1)

Jest 会自动找到项目中所有使用.spec.js 或.test.js 文件命名的测试文件并执行

通常我们在编写测试文件时遵循的命名规范：

测试文件的文件名 = 被测试模块名 + .test.js，例如被测试模块为 functions.js，那么对应的测试文件命名为 functions.test.js。

Jest 为我们提供了 expect 函数用来包装被测试的方法并返回一个对象

### 1.匹配器

> - .not 修饰符允许你测试结果不等于某个值的情况

```
//functions.test.js
import functions  from '../src/functions'

test('sum(2, 2) 不等于 5', () => {
  expect(functions.sum(2, 2)).not.toBe(5);
})
```

> - toEqual()

```
// functions.js
export default {
  getAuthor() {
    return {
      name: 'LITANGHUI',
      age: 24,
    }
  }
}
```

```
// functions.test.js
import functions  from '../src/functions';

test('getAuthor()返回的对象深度相等', () => {
  expect(functions.getAuthor()).toEqual(functions.getAuthor());
})

test('getAuthor()返回的对象内存地址不同', () => {
  expect(functions.getAuthor()).not.toBe(functions.getAuthor());
})
```

.toEqual 匹配器会递归的检查对象所有属性和属性值是否相等，所以如果要进行应用类型的比较时，请使用.toEqual 匹配器而不是.toBe。

> -.toHaveLength

```
// functions.js
export default {
  getIntArray(num) {
    if (!Number.isInteger(num)) {
      throw Error('"getIntArray"只接受整数类型的参数');
    }

    let result = [];
    for (let i = 0, len = num; i < len; i++) {
      result.push(i);
    }

    return result;
  }
}
```

```
// functions.test.js
import functions  from '../src/functions';

test('getIntArray(3)返回的数组长度应该为3', () => {
  expect(functions.getIntArray(3)).toHaveLength(3);
})
```

.toHaveLength 可以很方便的用来测试字符串和数组类型的长度是否满足预期。

> - .toThrow

```
// functions.test.js
import functions  from '../src/functions';

test('getIntArray(3.3)应该抛出错误', () => {
  function getIntArrayWrapFn() {
    functions.getIntArray(3.3);
  }
  expect(getIntArrayWrapFn).toThrow('"getIntArray"只接受整数类型的参数');
})
```

.toThorw 可能够让我们测试被测试方法是否按照预期抛出异常，但是在使用时需要注意的是：我们必须使用一个函数将将被测试的函数做一个包装，正如上面 getIntArrayWrapFn 所做的那样，否则会因为函数抛出导致该断言失败。

> - .toMatch

```
// functions.test.js
import functions  from '../src/functions';

test('getAuthor().name应该包含"li"这个姓氏', () => {
  expect(functions.getAuthor().name).toMatch(/li/i);
})
```

.toMatch 传入一个正则表达式，它允许我们用来进行字符串类型的正则匹配。

### 5 测试异步函数

我们将请求http://jsonplaceholder.typicode.com/users/1，这是由JSONPlaceholder提供的mock请求地址.jsONPlaceholder提供免费的在线REST服务（测试用的HTTP请求假数据）
