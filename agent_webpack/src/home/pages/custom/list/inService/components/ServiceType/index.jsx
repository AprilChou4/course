// 服务类型
import React, { Component } from 'react';
import { connect } from 'nuomi';
import PropTypes from 'prop-types';
import { Checkbox, message } from 'antd';
import Style from './style.less';

const CheckboxGroup = Checkbox.Group;

class ServiceType extends Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     // 服务类型选中的值
  //     checkedValue: props.value || [],
  //   };
  // }

  componentDidMount() {
    const { dispatch, value, serviceTypeList } = this.props;
    const serviceRelationList = [];
    serviceTypeList.forEach((item) => {
      const { companyServiceTypeId, companyServiceTypeValue } = item;
      if (value && value.includes(companyServiceTypeValue)) {
        serviceRelationList.push({
          companyServiceTypeId,
          companyServiceTypeValue,
        });
      }
    });
    dispatch({
      type: 'updateState',
      payload: {
        serviceRelationList,
      },
    });
  }

  // 修改服务类型
  changeServiceType = (arr) => {
    // const { checkedValue } = this.state;
    const { value } = this.props;
    const { serviceTypeList, onChange, onCheckBox, isLink } = this.props;
    if (isLink) {
      if (arr.includes(0) && !value.includes(3)) {
        if (!arr.includes(3)) {
          arr.push(3);
        }
      } else if (!arr.includes(0) && arr.includes(3)) {
        arr.splice(arr.findIndex((v) => v === 3), 1);
        if (!value.includes(0)) {
          message.warning('请先勾选代理记账');
        }
      }
    }
    const serviceRelationList = [];
    serviceTypeList.forEach((item) => {
      const { companyServiceTypeId, companyServiceTypeValue } = item;
      if (arr.includes(companyServiceTypeValue)) {
        serviceRelationList.push({
          companyServiceTypeId,
          companyServiceTypeValue,
        });
      }
    });

    // this.setState({
    //   checkedValue: arr,
    // });
    onCheckBox(arr, serviceRelationList);
    onChange(arr); // checkbox默认change方法
  };

  render() {
    const { serviceTypeList, dispatch, isLink, onChange, onCheckBox, ...rest } = this.props;
    serviceTypeList.forEach((item, key) => {
      serviceTypeList[key].value = item.companyServiceTypeValue;
      serviceTypeList[key].label = item.companyServiceTypeName;
      return item;
    });
    return (
      <CheckboxGroup
        className={Style['m-serviceType']}
        onChange={this.changeServiceType}
        options={serviceTypeList}
        {...rest}
      />
    );
  }
}

ServiceType.defaultProps = {
  // 服务类型是否有联动
  isLink: true,
  /** 改变复选框数据处理
   *  @param {array} checkedValue 选中数据
   *  @param {array} checkedObj 选中数据对象，包括服务类型值和id，用于新增
   */
  onCheckBox() {},
};

ServiceType.protoType = {
  // 服务类型是否有联动
  isLink: PropTypes.bool,
  onCheckBox: PropTypes.funs,
};

export default connect(({ serviceTypeList }) => ({
  serviceTypeList,
}))(ServiceType);
