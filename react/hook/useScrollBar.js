/**
 * 获取滚动条宽度
 * 使用：const [scrollBarWidth] = useScrollBar();
 */

import { useEffect, useState } from 'react'

const useScrollBar = () => {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const getScrollBarWidth = () => {
      const el = document.createElement('p')
      el.style.cssText =
        'width: 100px;height: 100px;overflow-y: scroll;opacity: 0;position: absolute;z-index: -1;'
      // 将元素加到body里面
      document.body.appendChild(el)
      const deltaWidth = el.offsetWidth - el.clientWidth
      // 将添加的元素删除
      document.body.removeChild(el)
      return deltaWidth
    }

    setWidth(getScrollBarWidth() || 0)
  }, [])

  return [width]
}

export default useScrollBar
