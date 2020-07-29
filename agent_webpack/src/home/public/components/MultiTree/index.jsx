import React, { Component } from 'react';
import { TreeSelect, Input, Form } from 'antd';
import PropTypes from 'prop-types';
import './style.less';

const { SHOW_ALL, SHOW_CHILD } = TreeSelect;

class MultiTreeSelect extends Component {
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
        if (newData.children && newData.children.length === 0) {
          newData.disableCheckbox = true;
        }
      }
      item.push(newData);
    });
    return item;
  };

  render() {
    //   <MultiTree
    //   field="drawer"
    //   fieldName="开票员"
    //   filedValue={drawer}
    //   treeData={drawerList}
    //   allEmployeeList={allEmployeeList}
    //   searchPlaceholder="输入有“代开平台”权限的员工"
    //   form={form}
    // />
    const {
      form: { getFieldDecorator },
      field,
      fieldValue,
      fieldName,
      treeData,
      keyName,
      titleName,
      val,
      showMode,
      allEmployeeList,
      filedValue,
      ...rest
    } = this.props;
    const data = this.loopList(treeData);
    const nameArr = [];
    filedValue &&
      filedValue.forEach((v) => {
        if (JSON.stringify(treeData).indexOf(v) !== -1) {
          nameArr.push(v);
        } else {
          allEmployeeList.forEach((item) => {
            if (item.staffId === v) {
              nameArr.push(item.name);
            }
          });
        }
      });
    return (
      <React.Fragment>
        {getFieldDecorator(field, {
          initialValue: fieldValue,
        })(<Input type="hidden" />)}
        <Form.Item label={`${fieldName}`} className="form-item form-right">
          {getFieldDecorator(`${field}Value`, {
            initialValue: nameArr,
          })(
            <TreeSelect
              treeData={data}
              // labelInValue
              treeCheckable
              allowClear
              treeDefaultExpandAll
              showCheckedStrategy={showMode ? SHOW_CHILD : SHOW_ALL} // 是"部门"时，要传"全公司"
              treeNodeFilterProp="title"
              dropdownStyle={{ maxHeight: 260 }}
              onChange={this.onChange}
              className="ui-multiTreeSelect"
              style={{ width: '100%' }}
              // value={nameArr}
              {...rest}
              getPopupContainer={(trigger) => trigger.parentNode}
            />,
          )}
        </Form.Item>
      </React.Fragment>
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
  // 当前key值
  field: '',
  // 默认值
  fieldValue: [],
  // label名称
  fieldName: '',
  form: {},
};

MultiTreeSelect.propTypes = {
  treeData: PropTypes.array,
  keyName: PropTypes.string,
  titleName: PropTypes.string,
  val: PropTypes.string,
  showMode: PropTypes.bool,
  allEmployeeList: PropTypes.array,
  field: PropTypes.string,
  fieldValue: PropTypes.array,
  fieldName: PropTypes.string,
};

export default MultiTreeSelect;
