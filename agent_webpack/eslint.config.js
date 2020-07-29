module.exports = {
  rules: {
    // 要求 return 语句要么总是指定返回的值，要么不指定
    'consistent-return': 0,
    // 禁止出现未使用过的表达式，禁止后三元运算符、短路运算符、标签模板都无法使用
    'no-unused-expressions': 0,
    // 禁止条件表达式中出现赋值操作符
    'no-cond-assign': 0,
    // 禁止函数return时进行赋值
    'no-return-assign': 0,
    // 要求使用 Error 对象作为 Promise reject的参数
    'prefer-promise-reject-errors': 0,

    // import的模块必须可以解析路径（启用后无法使用别名）
    'import/no-unresolved': 0,
    // 导出单个值时必须定义导出默认值
    'import/prefer-default-export': 0,
    // 禁止使用外部包
    'import/no-extraneous-dependencies': 0,

    // JSX代码必须包含在.jsx文件中
    'react/jsx-filename-extension': 0,
    // 截止定义的类型 ['any', 'array', 'object']
    'react/forbid-prop-types': 0,
    // 组件中使用的props必须定义defaultProps
    'react/require-default-props': 0,
    // 组件中使用的props必须定义propTypes
    'react/prop-types': 0,
    // JSX中不能使用bind方法
    'react/jsx-no-bind': 0,

    // 强制所有a标签必须定义有效的href属性
    'jsx-a11y/anchor-is-valid': 0,
    // 强制绑定onClick事件时必须绑定onKeyUp，onKeyDown，onKeyPress事件
    'jsx-a11y/click-events-have-key-events': 0,
    // 静态元素必须设置role属性来表达语义
    'jsx-a11y/no-static-element-interactions': 0,
    // 检查 Hook 的规则
    'react-hooks/rules-of-hooks': 2,
    // 检查 effect 的依赖
    'react-hooks/exhaustive-deps': 1,
  },
  plugins: ['react-hooks'],
  globals: {
    Nui: true,
    $: true,
    jQuery: true,
    noCaptcha: true,
    basePath: true,
    ssoUrl: true,
    userCenter: true,
  },
};
