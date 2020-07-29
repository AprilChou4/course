import React, { forwardRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Tree } from 'antd';
import If from '../../If';
import './style.less';

const { TreeNode } = Tree;

const AntdTree = forwardRef(
  ({ treeData, getTreeNodeProps, className, children, ...restProps }, ref) => {
    const treeNodes = useMemo(() => {
      const renderTreeNodes = (dataSource, parentNode) => {
        return dataSource.map((item) => {
          const props = getTreeNodeProps({
            ...item,
            parentNode,
          });
          const { childrenPropName = 'children' } = props;
          const datas = {
            ...item,
            ...props,
            dataRef: item,
          };
          if (item[childrenPropName]) {
            return (
              <TreeNode {...datas} parentNode={parentNode}>
                {renderTreeNodes(item[childrenPropName], datas)}
              </TreeNode>
            );
          }
          return <TreeNode {...datas} parentNode={parentNode} />;
        });
      };

      return renderTreeNodes(treeData);
    }, [getTreeNodeProps, treeData]);

    // 当首次渲染没有数据时，defaultExpandAll不生效;
    return (
      <If condition={treeData && treeData.length}>
        <Tree {...restProps} className={classnames('antdTree', className)} ref={ref}>
          {treeNodes}
        </Tree>
      </If>
    );
  },
);

AntdTree.defaultProps = {
  getTreeNodeProps: (data) => data,
};

AntdTree.propTypes = {
  getTreeNodeProps: PropTypes.func,
};

export default AntdTree;
