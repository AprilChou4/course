import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Checkbox, Tree } from 'antd';
import classnames from 'classnames';
import './style.less';

const { TreeNode } = Tree;

class SelectList extends Component {
  // constructor(props) {
  //   super(props);
  // }

  getCheckedAllData = (status) => ({
    checked: status === '1',
    indeterminate: status === '2',
  });

  onCheckedAllChange = (e) => {
    const {
      target: { checked },
    } = e;
    // const { dataSource, checkedKeys, onCheck } = this.props;
    // this.setCheckedAllStatus(checked ? '1' : '0');
    // onCheckedAllChange && onCheckedAllChange(e, this);

    // 返回所有的checkedKeys
    // onCheck && onCheck(,this);
  };

  // const setCheckedAllStatus = (status) => {
  //   this.setState({
  //     checkedAllStatus: status,
  //   });
  // };

  getParentNode = () => {};

  handleCheck = (checkedKeys, e) => {
    const { onCheck } = this.props;
    onCheck(checkedKeys, e);
  };

  // 生成树节点
  renderTreeNodes = (data, parentNode) => {
    const { getTreeNodeProps } = this.props;
    return data.map((item) => {
      const props = getTreeNodeProps({ ...item, parentNode });
      const { childrenPropName = 'children' } = props;
      const datas = {
        ...item,
        ...props,
        dataRef: item,
      };
      if (item[childrenPropName]) {
        return (
          <TreeNode {...datas} parentNode={parentNode}>
            {this.renderTreeNodes(item[childrenPropName], datas)}
          </TreeNode>
        );
      }
      return <TreeNode {...datas} parentNode={parentNode} />;
    });
  };

  // 计算checkedKeys
  getCheckedKeys = () => {};

  render() {
    const { style, title, footer, search, dataSource, ...restProps } = this.props;
    // const isControlled = 'checkedKeys' in this.props;
    // const  checkedKeys  = isControlled ? checkedKeys :  this.getCheckedKeys();
    // const  selectedKeys  = isControlled ? selectedKeys :  this.getSelectedKeys();

    // 对比dataSource跟checkedKeys，确定全选框状态
    const { checked, indeterminate } = this.getCheckedAllData();

    return (
      <div
        className={classnames('select-list', { 'select-list-with-footer': footer })}
        style={style}
      >
        <div className="select-list-header">
          <span>{title}</span>
          {/* {restProps.checkable ? (
            <Checkbox
              checked={checked}
              indeterminate={indeterminate}
              onChange={this.onCheckedAllChange}
            >
              {title}
            </Checkbox>
          ) : (
            <span>{title}</span>
          )} */}
        </div>
        <div className={classnames('select-list-body', { 'select-list-body-with-search': search })}>
          <div className="select-list-content">
            <div className="select-list-body-search-wrapper">{search && search(this)}</div>
            <div className="select-list-body-customize-wrapper">
              <Tree {...restProps} onCheck={this.handleCheck}>
                {this.renderTreeNodes(dataSource)}
              </Tree>
            </div>
          </div>
        </div>
        <div className="select-list-footer">{footer && footer(this)}</div>
      </div>
    );
  }
}

// 其他props都是Tree的
SelectList.propTypes = {
  title: PropTypes.string, // 头部标题
  checkable: PropTypes.bool,
  blockNode: PropTypes.bool,
  dataSource: PropTypes.array, // Tree的数据源
  defaultExpandAll: PropTypes.bool,
  style: PropTypes.object,
  search: PropTypes.func, // 搜索组件
  footer: PropTypes.func, // 底部组件
  onCheck: PropTypes.func,
  getTreeNodeProps: PropTypes.func, // 获取treeNode相关属性，返回值同antd-Tree的TreeNode props
};

SelectList.defaultProps = {
  checkable: false,
  blockNode: true,
  dataSource: [],
  defaultExpandAll: true,
  getTreeNodeProps() {
    return {};
  },
};

export default SelectList;
