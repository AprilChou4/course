import React, { forwardRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { TreeSelect } from 'antd';
import './style.less';

const { TreeNode } = TreeSelect;

const AntdTreeSelect = forwardRef(
  ({ treeData, getTreeNodeProps, className, dropdownClassName, children, ...restProps }, ref) => {
    const treeNodes = useMemo(() => {
      const renderTreeNodes = (dataSource, parentNode) => {
        return dataSource.map((item, index) => {
          const props = getTreeNodeProps({ ...item, parentNode }, index);
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

    return (
      <TreeSelect
        dropdownStyle={{ maxHeight: 300, overflow: 'auto', maxWidth: '100%' }}
        // getPopupContainer={(triggerNode) => triggerNode.parentNode}
        {...restProps}
        className={classnames('antd-select-tree', className)}
        dropdownClassName={classnames('antd-select-tree-dropdown', dropdownClassName)}
        ref={ref}
      >
        {treeNodes}
      </TreeSelect>
    );
  },
);

AntdTreeSelect.propTypes = {
  getTreeNodeProps: PropTypes.func, // 给dataSource传递属性
};

AntdTreeSelect.defaultProps = {
  getTreeNodeProps: (data) => data,
};

export default AntdTreeSelect;
