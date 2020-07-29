import React, { useState } from 'react';
import { Input, Icon, Checkbox, Tree } from 'antd';

import './style.less';

const { TreeNode } = Tree;

const TransferItem = ({
  title, // 左上角文案
  checkable, // 是否支持全选
  searchOpt, // 搜索框props
  dataSource, // 数据源
  getTreeNodeProps, // 获取树节点props
  onCheck, // 选择时回调
  onCheckAll, // 全选时回调
  checkAll, // 是否全选
  indeterminate, // 全选按钮的indeterminate状态
  checkedKeys, // 已选择的keys，传入代表受控组件
}) => {
  // 内部控制选中的key
  const [innerCheckedKeys, setInnertCheckKeys] = useState([]);
  // 内部控制全选的状态
  const [innerCheckAll, setInnerCheckAll] = useState(false);
  // 内部控制indeterminate
  const [innerIndeterminate, setIndeterminate] = useState(false);

  const allkeys = [];

  // 全选
  const handleCheckAll = (e) => {
    const keys = e.target.checked ? allkeys : [];
    onCheckAll && onCheckAll(e, keys);
    // 非受控组件，内部控制
    if (typeof checkAll !== 'boolean' && !checkedKeys) {
      setInnertCheckKeys(keys);
      setInnerCheckAll(e.target.checked);
      setIndeterminate(false);
    }
  };

  // 选择
  const handleCheck = (keys, e) => {
    onCheck && onCheck(keys, e, allkeys);
    // 非受控组件，内部控制
    if (typeof checkAll !== 'boolean' && !checkedKeys) {
      setInnertCheckKeys(keys);
      setIndeterminate(!!keys.length && keys.length < allkeys.length);
      setInnerCheckAll(allkeys.length === keys.length);
    }
  };

  // 生成树节点
  const renderTreeNodes = (data, parentNode) => {
    return data.map((item) => {
      const props = getTreeNodeProps({ ...item, parentNode });
      const { childrenPropName = 'children' } = props;
      !props.disabled && allkeys.push(props.key);
      if (item[childrenPropName]) {
        return (
          <TreeNode {...props} dataRef={item}>
            {renderTreeNodes(item[childrenPropName], item)}
          </TreeNode>
        );
      }
      return <TreeNode {...props} dataRef={item} />;
    });
  };

  return (
    <div styleName="transfer-item">
      <div styleName="transfer-item-header">
        {checkable ? (
          <Checkbox
            checked={checkAll || innerCheckAll}
            indeterminate={indeterminate || innerIndeterminate}
            onChange={handleCheckAll}
          >
            {title}
          </Checkbox>
        ) : (
          <span>{title}</span>
        )}
      </div>
      <div styleName="transfer-item-body">
        <div styleName="transfer-item-search-wrap">
          <Input
            prefix={<Icon type="search" style={{ color: 'rgba(0,0,0,.25)' }} />}
            allowClear
            {...searchOpt}
          />
        </div>
        <div styleName="transfer-item-conetnt-wrap">
          <Tree checkable checkedKeys={checkedKeys || innerCheckedKeys} onCheck={handleCheck}>
            {renderTreeNodes(dataSource)}
          </Tree>
        </div>
      </div>
    </div>
  );
};

export default TransferItem;
