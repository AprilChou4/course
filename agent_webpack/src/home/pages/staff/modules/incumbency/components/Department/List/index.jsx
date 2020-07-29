import React, { useCallback } from 'react';
import { connect } from 'nuomi';
import { AntdTree } from '@components';
import { get } from '@utils';
import styles from './style.less';

const List = ({ deptList, curDeptKey, dispatch }) => {
  const handelSelect = useCallback(
    (selectedKeys, e) => {
      if (!selectedKeys.length) {
        // 当前已选中了
        return;
      }

      dispatch({
        type: 'updateState',
        payload: {
          curDeptKey: selectedKeys[0],
          curDeptNodes: get(e, 'selectedNodes[0].props', {}),
        },
      });
      dispatch({
        type: 'query',
        payload: { init: true },
      });
    },
    [dispatch],
  );

  return (
    <AntdTree
      blockNode
      defaultExpandAll
      className={styles.tree}
      selectedKeys={[curDeptKey]}
      treeData={deptList}
      getTreeNodeProps={(record) => ({
        key: record.deptId,
        title: record.name,
      })}
      onSelect={handelSelect}
    />
  );
};

export default connect(({ deptList, curDeptKey }) => ({
  deptList,
  curDeptKey,
}))(List);
