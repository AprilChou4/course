import React, { Component, useEffect, useState, useCallback } from 'react';
import { TreeSelect } from 'antd';
import PropTypes from 'prop-types';
// import './style.less';

const { SHOW_ALL, SHOW_CHILD } = TreeSelect;
class MultiTreeSelect extends Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     newValue: props.value,
  //   };
  // }

  // componentWillReceiveProps(nextP) {
  //   this.setState({
  //     newValue: nextP.value,
  //   });
  // }

  // 递归遍历，修改属性名
  loopList = (data) => {
    const { treeData, keyName, titleName, val, showMode, ...rest } = this.props;
    const item = [];
    data.forEach((list) => {
      const newData = {};
      newData.key = list[keyName];
      newData.value = list[val];
      newData.title = list[titleName];
      newData.children = list.children && list.children.length ? this.loopList(list.children) : []; // 如果还有子集，就再次调用自己
      // 记账员、开票员、报税员、客户顾问的数据中部门、员工都有，但是只能选员工不能选部门
      if (data && list.isParent) {
        newData.selectable = false;
        if (
          newData.children &&
          (newData.children.length === 0 || !/isParent\"\:false/.test(JSON.stringify(list)))
        ) {
          newData.disableCheckbox = true;
        }
      }
      item.push(newData);
    });
    return item;
  };

  render() {
    const {
      treeData,
      keyName,
      titleName,
      val,
      showMode,
      allEmployeeList,
      value,
      ...rest
    } = this.props;
    // const { newValue } = this.state;
    const treeArr = this.loopList(treeData) || [];
    value &&
      Array.isArray(value) &&
      value.forEach((v) => {
        if (JSON.stringify(treeData).indexOf(v) === -1) {
          allEmployeeList.forEach(({ realName, staffId }) => {
            if (staffId === v) {
              treeArr[0] &&
                treeArr[0].children &&
                treeArr[0].children.push({
                  title: realName,
                  key: staffId,
                  value: staffId,
                  children: [],
                  style: { display: 'none' },
                });
            }
          });
        }
      });
    // 数组去重 多部门同一个用户
    // const newValue = [...new Set(value)];
    return (
      <TreeSelect
        treeData={treeArr}
        treeCheckable
        allowClear
        treeDefaultExpandAll
        showCheckedStrategy={showMode ? SHOW_CHILD : SHOW_ALL} // 是"部门"时，要传"全公司"
        treeNodeFilterProp="title"
        dropdownStyle={{ maxHeight: 260 }}
        onChange={this.onChange}
        className="ui-multiTreeSelect"
        style={{ width: '100%' }}
        value={value}
        getPopupContainer={(trigger) => trigger.parentNode}
        {...rest}
      />
    );
  }
}

MultiTreeSelect.defaultProps = {
  /**
   * @array 对应tree>treeData
   */
  treeData: [],
  /**
   * @String 对应tree>key
   */
  keyName: 'code',
  /**
   * @String 对应tree>title
   */
  titleName: 'name',
  /**
   * @String 对应tree>value
   */
  val: 'value',
  /**
   * @Boolean true=SHOW_CHILD/false=SHOW_All
   */
  showMode: true,
  /**
   * 所有员工合集
   */
  allEmployeeList: [],
};

MultiTreeSelect.propTypes = {
  treeData: PropTypes.array,
  keyName: PropTypes.string,
  titleName: PropTypes.string,
  val: PropTypes.string,
  showMode: PropTypes.bool,
  allEmployeeList: PropTypes.array,
};

export default MultiTreeSelect;
