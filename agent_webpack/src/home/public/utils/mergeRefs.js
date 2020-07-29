/* eslint-disable no-param-reassign */
/**
 * 原因：开发基础UI组件时，经常需要使用本地ref，但也需要使用React.forwardRef支持外部引用。本地而言，React无法提供在ref属性内设置两个ref的方法。
 * 作用：合并多个ref
 * @param {...Object} ref 任意ref，无需
 */
export default function mergeRefs(...refs) {
  return (value) => {
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(value);
      } else if (ref !== null && ref !== undefined) {
        ref.current = value;
      }
    });
  };
}
