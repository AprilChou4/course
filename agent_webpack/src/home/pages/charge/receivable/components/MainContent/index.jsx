import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useUpdateEffect } from 'react-use';
import { connect } from 'nuomi';
import moment from 'moment';
import { Form, Row, Col, DatePicker, Radio, InputNumber } from 'antd';
import {
  GenFormItem,
  AntdInput,
  LimitInput,
  NumberInput,
  AntdSelect,
  SuperSelect,
  DeptTreeSelect,
} from '@components';
import { isNil, trim, getSelectOptions } from '@utils';
import { dictionary } from '@pages/charge/receivable/utils';
import styles from './style.less';

const { Group: RadioGroup } = Radio;
const { MonthPicker } = DatePicker;
const formItemStyle = { width: '100%' };

const MainContent = ({
  form,
  form: { setFieldsValue },
  formInitialValues,
  customerList,
  businessStaffList,
  dispatch,
}) => {
  form.getFieldDecorator('shouldReceiveId', {
    initialValue: formInitialValues.shouldReceiveId,
  });

  const [periodicity, setPeriodicity] = useState(true); // 是否是周期性

  const {
    shouldReceiveId,
    srbNo,
    billDate,
    validPeriodNum,
    settlementMethod,
    startDate,
    endDate,
    deptId,
    businessStaffId,
  } = form.getFieldsValue() || {};

  // console.log('srbNo-render', srbNo);

  // 结算方式是“次”时，结束时间必填
  const isEndDateRequired = settlementMethod === 0;

  const disabledStartDate = useCallback(
    (startValue) => {
      if (!startValue || !endDate) {
        return false;
      }
      return startValue.valueOf() > endDate.valueOf();
    },
    [endDate],
  );

  const disabledEndDate = useCallback(
    (endValue) => {
      if (!startDate || !endValue) {
        return false;
      }
      return startDate.valueOf() > endValue.valueOf();
    },
    [startDate],
  );

  const customerOptions = useMemo(
    () =>
      getSelectOptions(customerList, (item) => ({
        value: item.customerId,
        name: item.customerName,
      })),
    [customerList],
  );

  const businessStaffOptions = useMemo(
    () =>
      getSelectOptions(businessStaffList, (item) => ({
        value: item.staffId,
        name: item.realName,
      })),
    [businessStaffList],
  );

  // 客户名称改变（重置整个页面数据到初始状态）
  const handleCustomerIdChange = useCallback(
    (value) => {
      dispatch({
        type: 'initAddReceivable',
        payload: {
          customerId: value,
          // srbNo,
          srbNo: form.getFieldValue('srbNo'),
        },
      });
    },
    [dispatch, form],
  );

  // 结算方式改变
  const handleSettlementMethodChange = useCallback(
    (value) => {
      if (value === 0) {
        // 如果选择非周期性，开始时间和有效期数字段 失效
        setFieldsValue({
          startDate: undefined,
          validPeriodNum: undefined,
        });
      } else if (!startDate) {
        // 如果选择周期性，开始时间没有值时填充值同单据日期
        setFieldsValue({
          startDate: billDate,
          // validPeriodNum: undefined,
        });
      }
    },
    [billDate, setFieldsValue, startDate],
  );

  // 部门改变
  const handleDeptChange = useCallback(
    (value) => {
      setFieldsValue({
        businessStaffId: undefined,
      });
      dispatch({
        type: 'getBusinessStaffList',
        payload: { deptId: value },
      });
    },
    [dispatch, setFieldsValue],
  );

  // 结束日期-开始日期+1=有效期数
  // 有效期数改变后（计算结束日期）
  const handleValidPeriodNumChange = useCallback(
    (value) => {
      // add前要使用moment包裹一下，否则会改变原始值
      setFieldsValue({
        endDate: value && startDate ? moment(startDate).add(Number(value) - 1, 'month') : undefined,
      });
    },
    [setFieldsValue, startDate],
  );

  // 开始日期改变后（计算有效期数）
  const handleStartDateChange = useCallback(
    (date) => {
      // 有效时间 = 结束日期 - 开始日期 + 1
      setFieldsValue({
        validPeriodNum: date && endDate ? endDate.diff(date, 'month') + 1 : undefined,
      });
    },
    [endDate, setFieldsValue],
  );

  // 开始日期改变后（计算有效期数）
  const handleEndDateChange = useCallback(
    (date) => {
      // 有效时间 = 结束日期 - 开始日期 + 1
      setFieldsValue({
        validPeriodNum: date && startDate ? date.diff(startDate, 'month') + 1 : undefined,
      });
    },
    [setFieldsValue, startDate],
  );

  const totalMoneyValidator = useCallback((rule, value, callback) => {
    if (isNil(value, '') || !trim(value)) {
      callback('总金额不能为空');
      return;
    }
    if (!(Number(value) > 0)) {
      callback('总金额需大于0');
      return;
    }
    callback();
  }, []);

  useEffect(() => {
    setPeriodicity(settlementMethod !== 0);
  }, [settlementMethod]);

  // 单据日期改变后，同步开始日期
  // useEffect(() => {
  //   dispatch({
  //     type: 'updateFormInitialValues',
  //     payload: {
  //       startDate: billDate,
  //     },
  //   });
  // }, [billDate, dispatch]);

  // 更新form
  useEffect(() => {
    dispatch({
      type: 'updateForm',
      payload: { form },
    });
  }, [dispatch, form]);

  const Picker = periodicity ? MonthPicker : DatePicker;

  return (
    <Form className={styles.form}>
      <div className={styles['main-content']}>
        <Row gutter={35}>
          <Col span={6}>
            <GenFormItem
              form={form}
              label="客户名称"
              name="customerId"
              initialValue={formInitialValues.customerId}
              rules={[{ required: true, message: '请选择客户名称' }]}
            >
              <SuperSelect
                placeholder="请选择客户名称"
                disabled={!!shouldReceiveId}
                onChange={handleCustomerIdChange}
              >
                {customerOptions}
              </SuperSelect>
            </GenFormItem>
          </Col>
          <Col span={6}>
            <GenFormItem
              form={form}
              label="单据编号"
              name="srbNo"
              initialValue={formInitialValues.srbNo}
            >
              <AntdInput disabled />
            </GenFormItem>
          </Col>
          <Col span={6}>
            <GenFormItem
              form={form}
              label="源单类型"
              name="sourceBillType"
              initialValue={formInitialValues.sourceBillType}
            >
              <AntdSelect
                disabled
                placeholder="请选择源单类型"
                dataSource={dictionary.sourceBillType.list}
              />
            </GenFormItem>
          </Col>
          <Col span={6}>
            <GenFormItem
              disabled
              form={form}
              label="源单据号"
              name="sourceBillNo"
              initialValue={formInitialValues.sourceBillNo}
            />
          </Col>
        </Row>
        <Row gutter={35}>
          <Col span={6}>
            <GenFormItem
              form={form}
              label="单据日期"
              name="billDate"
              initialValue={formInitialValues.billDate}
              rules={[{ required: true, message: '请选择单据日期' }]}
            >
              <DatePicker placeholder="请选择单据日期" allowClear={false} style={formItemStyle} />
            </GenFormItem>
          </Col>
          <Col span={6}>
            <GenFormItem
              form={form}
              label="总金额"
              required
              name="shouldReceiveMoney"
              initialValue={formInitialValues.shouldReceiveMoney}
              rules={[
                {
                  validator: totalMoneyValidator,
                },
              ]}
            >
              <NumberInput placeholder="请输入总金额" />
            </GenFormItem>
          </Col>
          <Col span={6}>
            <GenFormItem
              form={form}
              label="收款方式"
              name="payType"
              initialValue={formInitialValues.payType}
              rules={[{ required: true, message: '请选择收款方式' }]}
            >
              <RadioGroup options={dictionary.payType.list} />
            </GenFormItem>
          </Col>
          <Col span={6}>
            <GenFormItem
              form={form}
              label="结算方式"
              name="settlementMethod"
              initialValue={formInitialValues.settlementMethod}
              rules={[{ required: true, message: '请选择结算方式' }]}
            >
              <AntdSelect
                showSearch={false}
                placeholder="请选择结算方式"
                dataSource={dictionary.settlementMethod.list}
                onChange={handleSettlementMethodChange}
              />
            </GenFormItem>
          </Col>
        </Row>
        <Row gutter={35}>
          <Col span={6}>
            <GenFormItem
              form={form}
              label="有效期数"
              name="validPeriodNum"
              initialValue={formInitialValues.validPeriodNum}
              // rules={[{ required: isDateRequired && periodicity, message: '请选择有效期数' }]}
              // trigger="onBlur"
              // valuePropName="defaultValue"
            >
              <InputNumber
                {...(periodicity
                  ? { placeholder: '请输入有效期数' }
                  : { disabled: true, placeholder: '-' })}
                min={1}
                style={formItemStyle}
                onChange={handleValidPeriodNumChange}
              />
            </GenFormItem>
          </Col>
          <Col span={6}>
            <GenFormItem
              form={form}
              label="开始日期"
              name="startDate"
              className="label-required-hide"
              initialValue={formInitialValues.startDate}
              rules={[{ required: periodicity, message: '请选择服务开始日期' }]}
            >
              <Picker
                {...(periodicity
                  ? { placeholder: '请选择服务开始日期' }
                  : { disabled: true, placeholder: '-' })}
                allowClear={false}
                style={formItemStyle}
                disabledDate={disabledStartDate}
                onChange={handleStartDateChange}
              />
            </GenFormItem>
          </Col>
          <Col span={6}>
            <GenFormItem
              form={form}
              label="结束日期"
              name="endDate"
              initialValue={formInitialValues.endDate}
              rules={[{ required: isEndDateRequired, message: '请选择服务结束日期' }]}
            >
              <Picker
                placeholder="请选择服务结束日期"
                allowClear={false}
                style={formItemStyle}
                disabledDate={disabledEndDate}
                onChange={handleEndDateChange}
              />
            </GenFormItem>
          </Col>
          <Col span={6}>
            <GenFormItem
              form={form}
              label="部门"
              name="deptId"
              initialValue={formInitialValues.deptId}
              onChange={handleDeptChange}
            >
              <DeptTreeSelect allowClear type="all" />
            </GenFormItem>
          </Col>
        </Row>
        <Row gutter={35}>
          <Col span={6}>
            <GenFormItem
              form={form}
              label="业务员"
              name="businessStaffId"
              initialValue={formInitialValues.businessStaffId}
            >
              <SuperSelect allowClear placeholder="请选择业务员">
                {businessStaffOptions}
              </SuperSelect>
            </GenFormItem>
          </Col>
          <Col span={18}>
            <GenFormItem
              form={form}
              label="摘要"
              name="remark"
              initialValue={formInitialValues.remark}
              rules={[{ max: 200, message: '最大长度200' }]}
            >
              <LimitInput allowClear placeholder="请输入摘要" maxLength={200} />
            </GenFormItem>
          </Col>
        </Row>
      </div>
    </Form>
  );
};

export default connect(({ formInitialValues, customerList, businessStaffList }) => ({
  formInitialValues,
  customerList,
  businessStaffList,
}))(
  Form.create({
    onValuesChange: ({ dispatch }) => {
      dispatch({
        type: 'updateStatusOnPageChange',
      });
    },
  })(MainContent),
);
