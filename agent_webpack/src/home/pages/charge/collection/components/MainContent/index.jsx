import React, { useMemo } from 'react';
import { Form, Input, Row, Col, Select, DatePicker, message } from 'antd';
import { LimitInput, DeptTreeSelect, SuperSelect, NumberInput, GenFormItem } from '@components';
import { connect } from 'nuomi';
import { getSelectOptions } from '@utils';
import moment from 'moment';
import { getInitialValue, STORE_PREFIX } from '../../utils';

import './style.less';

const { Option } = Select;

const MainContent = ({
  form,
  formValues,
  receiptTypeList,
  receiptAccountList,
  receiptStaffList,
  businessStaffList,
  customerList,
  isReference,
  maxPreMoney,
  noUpdateAuth,
  dispatch,
}) => {
  // 客户名称下拉框列表
  const customerOptions = useMemo(
    () =>
      getSelectOptions(customerList, (item) => ({
        value: item.customerId,
        name: item.customerName,
      })),
    [customerList],
  );

  // 客户发生改变，请求该客户最大的预收金额
  const handleCustomerChange = (value) => {
    form.resetFields();
    dispatch({
      type: '$initForm',
      payload: false,
    });
    localStorage.setItem(`${STORE_PREFIX}_customerId`, value);
    if (!value) return;
    // 最大预收改变后，置空添加过使用的预收
    form.setFieldsValue({
      userPreReceiptMoney: undefined,
    });
    dispatch({
      type: '$getMaxMoney',
      payload: value,
    });
  };
  // 相关金额发生改变重新计算“本次预收”
  const getHandleChange = (key) => (value) => {
    const values = form.getFieldsValue(); // 这里不是最新的?
    values[key] = value;
    const { totalReceiptMoney, shouldTotalMoney, freeMoney, userPreReceiptMoney } = values;
    // 本次预收 = 应收 - 优惠 - 使用预收 - 收款
    let preReceiptMoney = 0;
    if (totalReceiptMoney && shouldTotalMoney) {
      preReceiptMoney =
        shouldTotalMoney - (freeMoney || 0) - (userPreReceiptMoney || 0) - totalReceiptMoney;
    }
    form.setFieldsValue({
      preReceiptMoney: preReceiptMoney > 0 ? '0.00' : Math.abs(preReceiptMoney).toFixed(2),
    });
  };
  // 收款金额
  const handleSkChange = getHandleChange('totalReceiptMoney');
  // 应收金额
  const handleYsChange = getHandleChange('shouldTotalMoney');
  // 优惠金额
  const handleYhChange = getHandleChange('freeMoney');
  // 使用预收
  const handleSyysChange = getHandleChange('userPreReceiptMoney');

  // 选择收款方式，带出对应的收款账号
  const handleReceiptTypeChange = (value) => {
    const { receiptTypeAccounts } = receiptTypeList.find(
      (item) => item.receiptTypeId === value,
    ) || { receiptTypeAccounts: [] };
    // 收款方式改变后，置空已选择的收款账号 只有一个收款账号直接带出
    form.setFieldsValue({
      receiptTypeAccountId:
        receiptTypeAccounts.length === 1 ? receiptTypeAccounts[0].receiptTypeAccountId : undefined,
    });
    dispatch({
      type: 'updateState',
      payload: {
        receiptAccountList: receiptTypeAccounts,
      },
    });
  };

  // 部门修改，根据部门ID请求部门下员工
  const handleDeptChange = (value) => {
    form.setFieldsValue({
      businessStaffId: undefined,
    });
    dispatch({
      type: '$getStaffByDeptId',
      payload: value,
    });
  };

  // 空白只做展示的表单组件
  const Blank = React.forwardRef(({ value }, ref) => {
    return <span ref={ref}>{value}</span>;
  });

  // 下拉框匹配不成功显示名字
  const initialCustomerId = getInitialValue(
    formValues.customerId,
    customerList,
    'customerId',
    formValues.customerName,
    'customerId',
  );

  const initialBusinessStaffId = getInitialValue(
    formValues.businessStaffId,
    businessStaffList,
    'staffId',
    formValues.businessStaffName,
    'businessStaffId',
  );

  const initialReceiptStaffId = getInitialValue(
    formValues.receiptStaffId,
    receiptStaffList,
    'staffId',
    formValues.receiptStaffName,
    'receiptStaffId',
  );

  return (
    <Form styleName="form">
      <div styleName="main-form">
        <Row gutter={35}>
          <Col span={6}>
            <GenFormItem
              form={form}
              label="客户名称"
              name="customerId"
              initialValue={initialCustomerId}
              rules={[{ required: true, message: '请选择客户名称' }]}
            >
              <SuperSelect
                allowClear
                placeholder="请选择客户名称"
                disabled={isReference || noUpdateAuth}
                onChange={handleCustomerChange}
              >
                {customerOptions}
              </SuperSelect>
            </GenFormItem>
          </Col>
          <Col span={6}>
            <GenFormItem
              form={form}
              label="单据编号"
              name="receiptNo"
              rules={[{ required: true, message: '请填写单据编号' }]}
              initialValue={formValues.receiptNo}
            >
              <Input placeholder="请输入单据编号" autoComplete="off" disabled />
            </GenFormItem>
          </Col>
          <Col span={6}>
            <GenFormItem
              form={form}
              label="源单类型"
              name="sourceBillType"
              initialValue={formValues.sourceBillType}
            >
              <Select placeholder="源单类型" disabled>
                <Option value={0}>单独创建</Option>
                <Option value={1}>应收单</Option>
              </Select>
            </GenFormItem>
          </Col>
          <Col span={6}>
            <GenFormItem
              form={form}
              label="源单据号"
              name="sourceBillNo"
              initialValue={formValues.sourceBillNo}
            >
              <Input disabled placeholder="-" />
            </GenFormItem>
          </Col>
        </Row>
        <Row gutter={35}>
          <Col span={6}>
            <GenFormItem
              form={form}
              label="收款金额"
              name="totalReceiptMoney"
              rules={[{ required: true, message: '请输入收款金额' }]}
              initialValue={formValues.totalReceiptMoney}
            >
              <NumberInput
                placeholder="请输入收款金额"
                onChange={handleSkChange}
                disabled={noUpdateAuth}
              />
            </GenFormItem>
          </Col>
          <Col span={6}>
            <GenFormItem
              form={form}
              label="收款日期"
              name="receiptDate"
              rules={[{ required: true, message: '请选择收款日期' }]}
              initialValue={
                formValues.receiptDate ? moment(formValues.receiptDate, 'X') : undefined
              }
            >
              <DatePicker
                placeholder="请选择收款日期"
                style={{ width: '100%' }}
                disabled={noUpdateAuth}
              />
            </GenFormItem>
          </Col>
          <Col span={6}>
            <GenFormItem
              form={form}
              label="收款方式"
              name="receiptType"
              initialValue={formValues.receiptType || undefined}
            >
              <Select
                placeholder="请选择收款方式"
                onChange={handleReceiptTypeChange}
                allowClear
                disabled={noUpdateAuth}
              >
                {receiptTypeList.map((item) => (
                  <Option value={item.receiptTypeId} key={item.receiptTypeId}>
                    {item.receiptTypeName}
                  </Option>
                ))}
              </Select>
            </GenFormItem>
          </Col>
          <Col span={6}>
            <GenFormItem
              form={form}
              label="收款账号"
              name="receiptTypeAccountId"
              initialValue={
                formValues.receiptTypeAccountId
                  ? Number(formValues.receiptTypeAccountId)
                  : undefined
              }
            >
              <Select placeholder="收款账号" allowClear disabled={noUpdateAuth}>
                {receiptAccountList.map((item) => (
                  <Option value={item.receiptTypeAccountId} key={item.receiptTypeAccountId}>
                    {item.receiptTypeAccount}
                  </Option>
                ))}
              </Select>
            </GenFormItem>
          </Col>
        </Row>
        <Row gutter={35}>
          <Col span={6}>
            <GenFormItem
              form={form}
              label="收款人"
              name="receiptStaffId"
              initialValue={initialReceiptStaffId || undefined}
            >
              <SuperSelect
                placeholder="请选择收款人"
                allowClear
                disabled={noUpdateAuth}
                onChange={(val) => {
                  localStorage.setItem(`${STORE_PREFIX}_receiptStaffId`, val);
                }}
              >
                {receiptStaffList.map((item) => (
                  <Option value={item.staffId} key={item.staffId}>
                    {item.realName}
                  </Option>
                ))}
              </SuperSelect>
            </GenFormItem>
          </Col>
          <Col span={6}>
            <GenFormItem
              form={form}
              label="部门"
              name="deptId"
              initialValue={formValues.deptId || undefined}
            >
              <DeptTreeSelect
                type="all"
                onChange={handleDeptChange}
                disabled={isReference || noUpdateAuth}
                allowClear
              />
            </GenFormItem>
          </Col>
          <Col span={6}>
            <GenFormItem
              form={form}
              label="业务员"
              name="businessStaffId"
              initialValue={initialBusinessStaffId || undefined}
            >
              <SuperSelect
                placeholder="请选择业务员"
                disabled={isReference || noUpdateAuth}
                allowClear
                onChange={(val) => {
                  localStorage.setItem(`${STORE_PREFIX}_businessStaffId`, val);
                }}
              >
                {businessStaffList.map((item) => (
                  <Option value={item.staffId} key={item.staffId}>
                    {item.realName}
                  </Option>
                ))}
              </SuperSelect>
            </GenFormItem>
          </Col>
        </Row>
        <Row gutter={35}>
          <Col span={6}>
            <GenFormItem
              form={form}
              label="应收总额"
              name="shouldTotalMoney"
              initialValue={formValues.shouldTotalMoney}
            >
              <NumberInput
                placeholder="请输入应收总额"
                onChange={handleYsChange}
                disabled={isReference || noUpdateAuth}
              />
            </GenFormItem>
          </Col>
          <Col span={6}>
            <GenFormItem
              form={form}
              label="优惠金额"
              name="freeMoney"
              initialValue={formValues.freeMoney}
            >
              <NumberInput
                placeholder="请输入优惠金额"
                onChange={handleYhChange}
                disabled={noUpdateAuth}
              />
            </GenFormItem>
          </Col>
          <Col span={6}>
            <GenFormItem
              form={form}
              label="本次预收"
              name="preReceiptMoney"
              initialValue={formValues.preReceiptMoney}
            >
              <Blank />
            </GenFormItem>
          </Col>
          <Col span={6}>
            <GenFormItem
              form={form}
              label="使用预收"
              name="userPreReceiptMoney"
              initialValue={formValues.userPreReceiptMoney}
            >
              <NumberInput
                disabled={maxPreMoney <= 0 || noUpdateAuth}
                onMax={() => {
                  message.warn(`使用预收不能超过最大值${maxPreMoney}`);
                }}
                placeholder="请输入使用预收"
                onChange={handleSyysChange}
                max={parseFloat(maxPreMoney)}
              />
            </GenFormItem>
          </Col>
        </Row>
        <GenFormItem form={form} label="摘要" name="remark" initialValue={formValues.remark}>
          <LimitInput maxLength={200} disabled={noUpdateAuth} />
        </GenFormItem>
      </div>
    </Form>
  );
};

export default connect(
  ({
    formValues,
    receiptTypeList,
    receiptAccountList,
    receiptStaffList,
    businessStaffList,
    customerList,
    isReference,
    maxPreMoney,
    noUpdateAuth,
  }) => ({
    formValues,
    receiptTypeList,
    receiptAccountList,
    receiptStaffList,
    businessStaffList,
    customerList,
    isReference,
    maxPreMoney,
    noUpdateAuth,
  }),
)(MainContent);
