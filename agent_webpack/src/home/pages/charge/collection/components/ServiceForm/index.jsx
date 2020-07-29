import React, { useMemo } from 'react';
import { message } from 'antd';
import { connect } from 'nuomi';
import { NumberInput, FormTable } from '@components';
import { get } from '@utils';
import { getUid, calcTotalMoney } from '../../utils';
import ServiceItems from '../../../components/ServiceItems';
import FormTableFooter from './Footer';

import './style.less';

const ServiceForm = ({
  serviceList,
  isReference,
  form,
  dataSource,
  totalMoney,
  maxPreMoney,
  tableForm,
  noUpdateAuth,
  dispatch,
}) => {
  // const tableForm = useRef({});
  // 计算出5列的各列的合计 ugly!
  const setTotalMoney = (list) => {
    const total = calcTotalMoney(list);
    dispatch({
      type: 'updateState',
      payload: {
        totalMoney: total,
      },
    });
  };

  // 相关金额发生改变重新计算“本次预收”
  const getHandleChange = (key) => (value, id) => {
    const values = tableForm.getFieldsValue();
    const index = dataSource.findIndex((it) => it.id === id);
    // console.log('values', values, index);
    values[index][key] = value;
    // console.log('rowValues', rowValues);
    const { receiptMoney, shouldMoney, freeMoney, userPreReceiptMoney } = values[index];
    // console.log(receiptMoney, shouldMoney, freeMoney, userPreReceiptMoney);
    // 本次预收 = 应收 - 优惠 - 使用预收 - 收款
    let preReceiptMoney = 0;
    // console.log(typeof receiptMoney, typeof shouldMoney);
    if (receiptMoney && shouldMoney) {
      preReceiptMoney = shouldMoney - (freeMoney || 0) - (userPreReceiptMoney || 0) - receiptMoney;
    }
    tableForm.setFieldsValue(
      {
        [`${id}.preReceiptMoney`]:
          preReceiptMoney > 0 ? '0.00' : Math.abs(preReceiptMoney).toFixed(2),
      },
      () => {
        // 算出每列总额
        setTotalMoney(tableForm.getFieldsValue());
      },
    );
    // 编辑改变按钮状态
    dispatch({
      type: 'changeStatus',
    });
  };
  // 收款金额
  const handleSkChange = getHandleChange('receiptMoney');
  // 应收金额
  const handleYsChange = getHandleChange('shouldMoney');
  // 优惠金额
  const handleYhChange = getHandleChange('freeMoney');
  // 使用预收
  const handleSyysChange = getHandleChange('userPreReceiptMoney');

  // 增加一行
  const handleAddTr = (record, index) => {
    if (isReference) return;
    const list = [...dataSource];
    list.splice(index + 1, 0, {
      id: getUid(),
    });
    dispatch({
      type: 'updateState',
      payload: {
        dataSource: list,
      },
    });
  };

  // 删除一行
  const handleRemoveTr = (record, index) => {
    if (isReference) return;
    let result = dataSource;
    if (dataSource.length <= 3) {
      // 小于三行 清空
      tableForm.resetFields(index);
      result = dataSource.map((it) => (it.id === record.id ? { id: record.id } : it));
      setTotalMoney(tableForm.getFieldsValue());
    } else {
      result = dataSource.filter((it) => it.id !== record.id);
    }
    dispatch({
      type: 'updateState',
      payload: {
        dataSource: result,
      },
    });
  };

  // 服务项目选择时
  const handleServiceItemChange = (record, value, option) => {
    const serviceTypeName = get(option, 'props.dataref.serviceName');
    tableForm.setFieldsValue({
      [`${record.id}.serviceTypeName`]: serviceTypeName,
    });
    const list = dataSource.map((it) =>
      it.id !== record.id ? it : { ...it, serviceItemId: value },
    );
    dispatch({
      type: 'updateState',
      payload: {
        dataSource: list,
      },
    });
    // 编辑改变按钮状态
    dispatch({
      type: 'changeStatus',
    });
  };

  const selectedMap = useMemo(() => {
    return dataSource.reduce((a, c) => ({ ...a, [c.serviceItemId]: true }), {});
  }, [dataSource]);

  // 获取表格列, 1. 服务项目+服务类型 2.摘要
  const columns = [
    {
      title: '服务项目',
      dataIndex: 'serviceItemId',
      key: 'serviceItemId',
      align: 'center',
      className: 'form-table-service-item-td',
      total: '合计',
      render(text, record) {
        const customerId = form.getFieldValue('customerId');
        return (
          <ServiceItems
            showArrow={false}
            disabled={isReference || !customerId || noUpdateAuth}
            dataSource={serviceList}
            getSelectNodeProps={(item) => ({
              value: Number(item.chargingItemId),
              name: item.itemName,
              disabled: selectedMap[item.chargingItemId],
            })}
            onChange={(...args) => handleServiceItemChange(record, ...args)}
            style={{ width: '100%' }}
          />
        );
      },
    },
    {
      title: '服务类型',
      dataIndex: 'serviceTypeName',
      key: 'serviceTypeName',
      align: 'center',
    },
    {
      title: '应收金额（元）',
      dataIndex: 'shouldMoney',
      key: 'shouldMoney',
      align: 'center',
      total: totalMoney.shouldTotalMoney,
      render(text, record) {
        if (!record.serviceItemId && !record.remark) {
          return null;
        }
        return (
          <NumberInput
            style={{ textAlign: 'right' }}
            placeholder="0.00"
            disabled={isReference || noUpdateAuth}
            onChange={(v) => handleYsChange(v, record.id)}
          />
        );
      },
    },
    {
      title: '实收金额（元）',
      dataIndex: 'receiptMoney',
      key: 'receiptMoney',
      align: 'center',
      fieldDecorator: {
        rules: [{ required: true, message: '' }],
      },
      asterisk: true,
      total: totalMoney.totalReceiptMoney,
      render(text, record) {
        if (!record.serviceItemId && !record.remark) {
          return null;
        }
        return (
          <NumberInput
            style={{ textAlign: 'right' }}
            disabled={noUpdateAuth}
            placeholder="0.00"
            onChange={(v) => handleSkChange(v, record.id)}
          />
        );
      },
    },
    {
      title: '优惠金额（元）',
      dataIndex: 'freeMoney',
      key: 'freeMoney',
      align: 'center',
      total: totalMoney.freeMoney,
      render(text, record) {
        // const serviceItemId = tableForm.getFieldValue(index, 'serviceItemId');
        if (!record.serviceItemId && !record.remark) {
          return null;
        }
        return (
          <NumberInput
            style={{ textAlign: 'right' }}
            placeholder="0.00"
            disabled={noUpdateAuth}
            onChange={(v) => handleYhChange(v, record.id)}
          />
        );
      },
    },
    {
      title: '本次预收',
      dataIndex: 'preReceiptMoney',
      key: 'preReceiptMoney',
      total: totalMoney.preReceiptMoney,
      align: 'center',
      className: 'form-table-pre-receipt-td',
    },
    {
      title: '使用预收',
      dataIndex: 'userPreReceiptMoney',
      key: 'userPreReceiptMoney',
      align: 'center',
      total: totalMoney.userPreReceiptMoney,
      render(text, record, index) {
        const userPreReceiptMoney = tableForm.getFieldValue(index, 'userPreReceiptMoney');
        if (!record.serviceItemId && !record.remark) {
          return null;
        }
        const max = maxPreMoney - (totalMoney.userPreReceiptMoney - (userPreReceiptMoney || 0));
        // console.log(
        //   maxPreMoney,
        //   totalMoney.userPreReceiptMoney,
        //   record.userPreReceiptMoney,
        //   userPreReceiptMoney,
        // );
        return (
          <NumberInput
            style={{ textAlign: 'right' }}
            disabled={maxPreMoney <= 0 || noUpdateAuth}
            onMax={() => {
              message.warn(`使用预收的和不能超过最大值${maxPreMoney}`);
            }}
            onChange={(v) => handleSyysChange(v, record.id)}
            max={max}
            placeholder="0.00"
          />
        );
      },
    },
  ];
  // 应收单只填表头, 未填明细
  const isPlanList = isReference && dataSource.some((it) => it.remark);
  if (isReference && isPlanList) {
    columns.splice(0, 2, {
      title: '摘要',
      dataIndex: 'remark',
      key: 'remark',
      align: 'center',
    });
  }

  return (
    <FormTable
      rowKey="id"
      dataSource={dataSource}
      columns={columns}
      getForm={(f) => {
        dispatch({
          type: 'updateState',
          payload: {
            tableForm: f,
          },
        });
      }}
      onAddTr={handleAddTr}
      onDeleteTr={handleRemoveTr}
      onAddIcon={() => ({
        className: isReference || noUpdateAuth ? 'collection-refrence-disable' : '',
      })}
      onDelIcon={() => ({
        className: isReference || noUpdateAuth ? 'collection-refrence-disable' : '',
      })}
      className="collection-form-table"
      footer={() => <FormTableFooter columns={columns} />}
    />
  );
};

export default connect(
  ({
    form,
    tableForm,
    serviceList,
    totalMoney,
    isReference,
    dataSource,
    maxPreMoney,
    noUpdateAuth,
  }) => ({
    form,
    tableForm,
    serviceList,
    dataSource,
    totalMoney,
    maxPreMoney,
    noUpdateAuth,
    isReference,
  }),
)(ServiceForm);
