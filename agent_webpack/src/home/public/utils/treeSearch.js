/**
 * 递归查找树节点
 *
 * @param {*object} treeData 树数据
 * @param {*string} target  目标值，默认是id的值，可在options中配置的目标属性（targetPropName）
 * @param {*string} options 其他配置项（targetPropName：目标属性名称，childrenPropName：子元素属性名称）
 */

// 显式堆栈迭代（会更改源数据！）
// eslint-disable-next-line consistent-return
// const search = (treeData, target, options = {}) => {
//   const { targetPropName = 'id', childrenPropName = 'children' } = options;

//   const stack = treeData;

//   while (stack.length) {
//     const curr = stack.pop();

//     if (curr[targetPropName] === target) {
//       return curr;
//     }

//     stack.push(...curr[childrenPropName]);
//   }
// };

// eslint-disable-next-line consistent-return
const search = (treeData, target, options = {}) => {
  const { targetPropName = 'id', childrenPropName = 'children' } = options;

  if (treeData[targetPropName] === target) {
    return treeData;
  }

  for (const child of treeData[childrenPropName]) {
    const res = search(child, target, options);

    if (res) {
      return res;
    }
  }
};

export default search;
