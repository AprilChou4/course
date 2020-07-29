// 与代账交互
/**
 * 子组件传递父组件路由跳转
 * @param {*String} type 交互类型
 * @param {*} payload url=路由地址 query=路由参数
 */
const postMessageRouter = ({ type, payload = {} }) => {
  window.parent.postMessage(
    JSON.stringify({
      type,
      payload,
    }),
    '*',
  );
};
export default postMessageRouter;
