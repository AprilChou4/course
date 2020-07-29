module.exports = {
  printWidth: 100, // 超过最大值换行
  tabWidth: 2, // 缩进字节数
  semi: true, // 句尾添加分号
  singleQuote: true, // 使用单引号代替双引号
  trailingComma: 'all', // 在对象或数组最后一个元素后面是否加逗号（在ES5中加尾逗号）
  arrowParens: 'always', //  (x) => {} 箭头函数参数只有一个时是否要有小括号。avoid：省略括号
  endOfLine: 'lf', // 行尾序列
  overrides: [
    {
      files: ['*.css', '*.less'],
      options: {
        singleQuote: false,
      },
    },
  ],
};
