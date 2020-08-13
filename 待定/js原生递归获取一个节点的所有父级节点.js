 /**
     * getParentTag - 获取传入标签的所有父级标签
     *
     * @param  { HTMLElement } startTag 初始dom节点
     * @param  {Array} parentTagList 初始dom节点的所有父级节点
     * @return {type} 递归/初始dom节点的所有父级节点
     */
    function getParentTag(startTag, parentTagList = []) {
      // 传入标签是否是DOM对象
      if (!(startTag instanceof HTMLElement)) return console.error('receive only HTMLElement');
      // 父级标签是否是body,是着停止返回集合,反之继续
      if ('BODY' !== startTag.parentElement.nodeName) {
        // 放入集合
        parentTagList.push(startTag.parentElement)
        // 再上一层寻找
        return getParentTag(startTag.parentElement, parentTagList)
      }
      // 返回集合,结束
      else return parentTagList;
 
    }
