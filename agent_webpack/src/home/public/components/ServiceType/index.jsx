// 服务类型
import React, { Component, Fragment } from 'react';
import { intersection } from 'lodash';
import PropTypes from 'prop-types';
import { Checkbox, message } from 'antd';
import './style.less';

const CheckboxGroup = Checkbox.Group;

class ServiceType extends Component {
  state = {
    isDlsb: false, // 代理申报是否能勾选
  };
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     // 服务类型选中的值
  //     checkedValue: props.value || [],
  //   };
  // }

  componentDidMount() {
    const { value, serviceTypeList } = this.props;
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
  }

  componentWillReceiveProps(nextP) {
    this.setState({
      isDlsb: nextP.value.includes(0),
    });
  }

  // 修改服务类型
  changeServiceType = (arr) => {
    const { isDlsb } = this.state;
    let flag = false;
    const {
      value,
      serviceTypeList,
      onChange,
      onCheckBox,
      isLink,
      hasInvoice,
      isCreate,
    } = this.props;

    if (isLink) {
      if (arr.includes(0)) {
        if (!arr.includes(3) && !isDlsb) {
          arr.push(3);
        }
        flag = true;
      } else {
        if (arr.includes(3) && isCreate !== 1) {
          arr.splice(arr.findIndex((v) => v === 3), 1);
          if (!value.includes(0)) {
            message.warning('请先勾选代理记账');
          }
        } else if (isCreate === 1) {
          arr.push(0);
          message.warning('当前客户已建账，不支持取消代理记账服务类型');
        }
        flag = false;
      }

      if (hasInvoice && !arr.includes(2)) {
        arr.push(2);
        message.warning('当前客户存在委托代开单，不支持取消代理记账服务类型');
      }
    }
    this.setState({
      isDlsb: flag,
    });
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

    onCheckBox(arr, serviceRelationList);
    onChange(arr); // checkbox默认change方法
  };

  render() {
    const {
      serviceTypeList,
      dispatch,
      isLink,
      hasInvoice,
      isCreate,
      onChange,
      onCheckBox,
      ...rest
    } = this.props;
    serviceTypeList.forEach((item, key) => {
      serviceTypeList[key].value = item.companyServiceTypeValue;
      serviceTypeList[key].label = item.companyServiceTypeName;
      return item;
    });
    return (
      <CheckboxGroup
        className="ui-serviceType"
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
  // 服务类型列表
  serviceTypeList: [],
  /** 改变复选框数据处理
   *  @param {array} checkedValue 选中数据
   *  @param {array} checkedObj 选中数据对象，包括服务类型值和id，用于新增
   */
  onCheckBox() {},
  // 客户是否有委托代开单， 当客户有委托代开单，取消代理开票时，应该提示不可取消
  hasInvoice: false,
  // 1=已建账， 0=未建账 当前客户已建账，不支持取消代理记账服务类型
  isCreate: 0,
};

ServiceType.protoType = {
  // 服务类型是否有联动
  isLink: PropTypes.bool,
  serviceTypeList: PropTypes.array,
  onCheckBox: PropTypes.funs,
  hasInvoice: PropTypes.bool,
  isCreate: PropTypes.number,
};

export default ServiceType;
