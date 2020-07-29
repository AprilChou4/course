/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useEffect, useCallback } from 'react';

/**
 * 自定义hook
 * 基于useCallback的事件处理器
 * 适用于useCallback依赖于经常变化的值，你想要记住的callback是一个事件处理器并且在渲染期间没有被用到
 *
 * @param {*} fn
 * @param {*} dependencies
 * @returns
 */
function useEventCallback(fn, dependencies) {
  const ref = useRef(() => {
    throw new Error('Cannot call an event handler while rendering.');
  });

  useEffect(() => {
    ref.current = fn; // 把它写入 ref
  }, [fn, ...dependencies]);

  return useCallback(() => {
    const fns = ref.current; // 从 ref 读取它
    return fns();
  }, [ref]); // 不要像 [text] 那样重新创建callback
}
export default useEventCallback;
