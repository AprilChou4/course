/* eslint-disable no-underscore-dangle */
// 事件埋点
export default function(...args) {
  window._hmt.push(['_trackEvent'].concat(args));
}
