import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Form, Input, Select, Checkbox, AutoComplete } from 'antd';
import { connect, router } from 'nuomi';
import { InputLimit } from '@components/InputLimit';
import { parentIndustry, childIndustry } from '@utils/industry';
import services from '../../services';

import './style.less';

const { Option } = Select;

const BaseForm = ({ form, dispatch, isEditing, formParams, customerOptions, isNationalTicket }) => {
  // 缓存当前的行业类型大类
  const [cacheIndustry, setCacheIndustry] = useState(formParams.industryTypeParent);
  // 纳税性质Ref
  const vatTypeRef = useRef({});

  useEffect(() => {
    setCacheIndustry(formParams.industryTypeParent < 0 ? '' : formParams.industryTypeParent);
  }, [formParams]);

  // 路由query中存在editVatType 代表是税务信息Tab下新增税种跳转过来 #129250
  useEffect(() => {
    const { editVatType } = router.location().query || {};
    if (+editVatType === 1) {
      vatTypeRef.current.focus();
    }
  }, []);

  // 客户编码编辑，检查重复
  async function checkSameCode(rule, value, callback) {
    const { customerId } = router.location().query || {};
    try {
      const result = await services.checkSameCode({
        customerId,
        customerCode: value,
      });
      const message = result ? '客户编码不可重复' : undefined;
      callback(message);
    } catch (error) {
      //
    }
  }

  // 客户名称编辑，检查重复
  async function checkSameName(rule, value, callback) {
    const { customerId } = router.location().query || {};
    const result = await services.checkSameName({
      customerName: value,
      customerId,
    });
    try {
      const message = result ? '客户名称不可重复' : undefined;
      callback(message);
    } catch (error) {
      //
    }
  }

  // 输入建议
  function onSearch(value) {
    if (!value) {
      dispatch({
        type: 'updateState',
        payload: {
          customerOptions: [],
        },
      });
      return;
    }
    dispatch({
      type: 'searchCustomer',
      payload: value,
    });
  }

  // 选择建议中一条
  function onSelect(code) {
    const currentCustomer = customerOptions.find((item) => item.unifiedSocialCreditCode === code);
    form.setFieldsValue({
      unifiedSocialCreditCode: code,
      customerName: currentCustomer.customerName,
    });
    dispatch({
      type: 'updateState',
      payload: {
        customerOptions: [],
      },
    });
  }

  // 选中行业类型大类
  function onParentSelect() {
    form.setFieldsValue({
      industryType: undefined,
    });
  }

  // 选中行业类型小类
  function onChildSelect(value) {
    if (form.getFieldValue('industryTypeParent')) return;
    const current = childIndustry.find((it) => it.name === value);
    setCacheIndustry(current.parent);
    form.setFieldsValue({
      industryTypeParent: current.parent,
      industryType: value,
    });
  }

  // 行业类型大类被清空
  function onParentChange(value) {
    setCacheIndustry(value);
    if (!value) {
      form.setFieldsValue({
        industryType: undefined,
      });
    }
  }

  // 客户输入下拉选项
  const customerNameOpt = customerOptions.map((customer) => (
    <AutoComplete.Option key={customer.unifiedSocialCreditCode}>
      {customer.customerName}
    </AutoComplete.Option>
  ));

  // // 计算获得行业类型小类的下拉列表
  const smallIndustryList = useMemo(() => {
    if (!cacheIndustry) {
      return childIndustry.map((it) => it.name);
    }
    return childIndustry.filter((it) => it.parent === cacheIndustry).map((it) => it.name);
  }, [cacheIndustry]);

  const { getFieldDecorator } = form;

  // 纳税性质的样式，营改增企业存在时 宽度变窄
  const vatTypeStyle = formParams.vatType === 0 ? { width: 298, marginRight: 10 } : {};

  return (
    <dl className="form-block">
      <dt>基本信息</dt>
      <dd>
        <div className="form-row">
          <Form.Item label="客户编码">
            {getFieldDecorator('customerCode', {
              initialValue: formParams.customerCode,
              rules: [{ validator: checkSameCode }],
            })(
              <InputLimit
                placeholder="请输入客户编码"
                maxLength={30}
                autoComplete="off"
                disabled={!isEditing}
              />,
            )}
          </Form.Item>
          <Form.Item label="客户名称">
            {getFieldDecorator('customerName', {
              rules: [
                {
                  whitespace: true,
                  message: '请输入非空格字符',
                },
                { required: true, message: '请输入客户名称' },
                { validator: checkSameName },
              ],
              initialValue: formParams.customerName,
            })(
              <AutoComplete
                placeholder="请输入客户名称"
                dataSource={customerNameOpt}
                onSelect={onSelect}
                onSearch={onSearch}
                disabled={!isEditing}
              >
                <InputLimit maxLength={40} autoComplete="off" />
              </AutoComplete>,
            )}
          </Form.Item>
        </div>
        <div className="form-row">
          <Form.Item label="统一社会信用代码">
            {getFieldDecorator('unifiedSocialCreditCode', {
              initialValue: formParams.unifiedSocialCreditCode,
              rules: [
                isNationalTicket && {
                  required: true,
                  message: '请填写统一社会信用代码',
                },
                {
                  pattern: /^[a-zA-Z0-9]{15,20}$/,
                  message: '格式有误，须为15~20位数字、字母',
                },
              ],
            })(
              <Input
                placeholder={isEditing ? '请输入统一社会信用代码' : '-'}
                autoComplete="off"
                disabled={!isEditing}
              />,
            )}
          </Form.Item>
          <Form.Item label="纳税性质">
            {getFieldDecorator('vatType', {
              initialValue:
                formParams.vatType < 0 || formParams.vatType === null
                  ? undefined
                  : formParams.vatType,
              rules: isNationalTicket
                ? [
                    {
                      required: true,
                      message: '请选择纳税性质',
                    },
                  ]
                : [],
            })(
              <Select
                ref={vatTypeRef}
                style={vatTypeStyle}
                placeholder={isEditing ? '请选择纳税性质' : '-'}
                disabled={!isEditing}
                getPopupContainer={(triggerNode) => triggerNode.parentNode}
              >
                <Option value={0}>一般纳税人</Option>
                <Option value={1}>小规模纳税人</Option>
              </Select>,
            )}
            {formParams.vatType === 0 && (
              <Form.Item style={{ width: 90, marginBottom: 0, overflow: 'hidden' }}>
                {getFieldDecorator('hasCampToIncreaseTaxReport', {
                  valuePropName: 'checked',
                  initialValue: Boolean(formParams.hasCampToIncreaseTaxReport),
                })(<Checkbox disabled={!isEditing}>营改增企业</Checkbox>)}
              </Form.Item>
            )}
          </Form.Item>
        </div>
        <div className="form-row">
          <Form.Item label="行业类型" styleName="industry-type-form-item">
            {getFieldDecorator('industryTypeParent', {
              initialValue:
                formParams.industryTypeParent < 0 || !formParams.industryTypeParent
                  ? undefined
                  : formParams.industryTypeParent,
            })(
              <Select
                allowClear
                disabled={!isEditing}
                onSelect={onParentSelect}
                onChange={onParentChange}
                placeholder={isEditing ? '请选择行业类型' : '-'}
                showSearch
                getPopupContainer={(triggerNode) => triggerNode.parentNode}
                filterOption={(inputValue, option) => {
                  return option.props.value.indexOf(inputValue) > -1;
                }}
              >
                {parentIndustry.map((name) => (
                  <Option value={name} key={name}>
                    {name}
                  </Option>
                ))}
              </Select>,
            )}
          </Form.Item>
          <Form.Item styleName="industry-type-form-item">
            {getFieldDecorator('industryType', {
              initialValue:
                formParams.industryType < 0 || !formParams.industryType
                  ? undefined
                  : formParams.industryType,
            })(
              <Select
                allowClear
                disabled={!isEditing}
                placeholder={isEditing ? '请选择行业类型' : '-'}
                onSelect={onChildSelect}
                showSearch
                getPopupContainer={(triggerNode) => triggerNode.parentNode}
                filterOption={(inputValue, option) => {
                  return option.props.value.indexOf(inputValue) > -1;
                }}
              >
                {smallIndustryList.map((name) => (
                  <Option value={name} key={name}>
                    {name}
                  </Option>
                ))}
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="成品油企业">
            {getFieldDecorator('isProductOil', {
              initialValue:
                formParams.isProductOil < 0 || formParams.isProductOil === null
                  ? undefined
                  : formParams.isProductOil,
            })(
              <Select
                placeholder={isEditing ? '请选择成品油企业' : '-'}
                allowClear
                disabled={!isEditing}
                getPopupContainer={(triggerNode) => triggerNode.parentNode}
              >
                <Option value={1}>是</Option>
                <Option value={0}>否</Option>
              </Select>,
            )}
          </Form.Item>
        </div>
        <div className="form-row">
          <Form.Item label="进出口企业">
            {getFieldDecorator('isForeignTrade', {
              initialValue:
                formParams.isForeignTrade < 0 || formParams.isForeignTrade === null
                  ? undefined
                  : formParams.isForeignTrade,
            })(
              <Select
                placeholder={isEditing ? '请选择进出口企业' : '-'}
                allowClear
                disabled={!isEditing}
                getPopupContainer={(triggerNode) => triggerNode.parentNode}
              >
                <Option value={1}>是</Option>
                <Option value={0}>否</Option>
              </Select>,
            )}
          </Form.Item>
        </div>
      </dd>
    </dl>
  );
};

const mapStateToProps = ({ formParams, isEditing, customerOptions, isNationalTicket }) => ({
  formParams,
  isEditing,
  customerOptions,
  isNationalTicket,
});

export default connect(mapStateToProps)(BaseForm);
