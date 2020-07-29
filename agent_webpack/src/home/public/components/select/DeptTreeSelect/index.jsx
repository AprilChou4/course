/**
 * 部门树下拉框组件
 */
import React, { forwardRef, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import globalServices from '@home/services';
import AntdTreeSelect from '../AntdTreeSelect';
import './style.less';

const DeptTreeSelect = forwardRef(
  ({ type, hideUnassigned, className, dropdownClassName, ...restProps }, ref) => {
    const [deptList, setDeptList] = useState([]);

    const getDeptList = useCallback(async () => {
      const list = await globalServices[type === 'all' ? 'getAllDeptList' : 'getDeptList']();
      setDeptList(list || []);
    }, [type]);

    useEffect(() => {
      getDeptList();
    }, [getDeptList]);

    return (
      <AntdTreeSelect
        blockNode
        dropdownMatchSelectWidth
        treeDefaultExpandAll
        placeholder="请选择部门"
        treeData={deptList}
        getTreeNodeProps={(record) => ({
          key: record.deptId,
          value: record.deptId,
          title: record.name,
          style:
            hideUnassigned && record.name === '未分配'
              ? {
                  display: 'none',
                }
              : {},
        })}
        className={classnames('antd-tree-select-dept', className)}
        dropdownClassName={classnames('antd-select-tree-dept-dropdown', dropdownClassName)}
        {...restProps}
        ref={ref}
      />
    );
  },
);

DeptTreeSelect.defaultProps = {
  hideUnassigned: false,
};

DeptTreeSelect.propTypes = {
  hideUnassigned: PropTypes.bool, // 隐藏"未分配"部门
};

export default DeptTreeSelect;
