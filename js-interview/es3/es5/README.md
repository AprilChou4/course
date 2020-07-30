### [ES5/ES3 对比，重新思考 ES5 带来的提升](jianshu.com/p/4fe974a7a789)

> - getter/setter 存取器

es5

```
var o = {a:1, b:2, get c() {return this.a + this.b}, set c(val) {this.a = val - this.b}};
console.log(o.c);  //3
o.c = 6;
console.log(o.a);  //4
```

es3:

```
var o = {a: 1, b: 2, getc: function() {return this.a +  this.b}, setc: function(val) {this.a = val - this.b}};
console.log(o.getc());  //3
o.setc(6);
console.log(o.a);  //4
```

可以看到使用了 getter/setter 后虚拟属性 c 用起来更加自然，与普通属性达到了相同的使用形式。同时，如果要对现有属性在存/取时每次都添加逻辑，可以把数据属性改写成存取器属性，这样既不用改写现有业务代码，同时也达到了代码复用以及保证添加了的逻辑没有遗漏。

> - 对象/数组末尾的逗号

es5:

```
var a = {
  x:2,
  y:3,
}, b = [1,2,3,]
```

es3:

```
var a = {
  x:2,
  y:3
}, b = [1,2,3]
```

对象/数组末尾可选的逗号使复制剪切粘贴时更加的方便

> - 数组迭代方法
>   es5:

```
var arr = [2,6,34,9,65,4,7];
var arr2 = arr.filter(function(val) {return val > 10});
console.log(arr2);  //[34, 65]
```

es3:

```
var arr = [2,6,34,9,65,4,7];
var arr2 = [];
for (var i in arr) {
  if (arr[i] > 10)
    arr2.push(arr[i]);
}
console.log(arr2);  //[34, 65]
```

数组的迭代方法让我们做一些数组操作的代码变得极为简洁，极大的提高了可读性和可维护性。其它的迭代方法还有 indexOf, lastIndexOf, forEach, every, some, map, reduce 和 reduceRight。

> - String.prototype.trim()

es5:

```
console.log('  123  456  '.trim());  //'123  456'
```

es3:

```
console.log(' 123 456 '.replace(/(^\s+)|(\s+\$)/g, '')); //'123 456'
```

再也不用用正则表达式去空格了，在表单验证中很有用。

> - Date.now()
>   es5:

```
console.log(Date.now());  //1494091196365
```

es3:

```
console.log(new Date().getTime()); //1494091196365
```

获取当前时间毫秒数不再需要先创建对象了，由此带来开发效率与运行效率的双重提升。
