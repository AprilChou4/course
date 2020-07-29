import React from 'react';
import moment from 'moment';
import { DatePicker, Icon } from 'antd';
import pubData from 'data';
import { If, LinkButton, AntdSelect, NumberInput } from '@components';
import { isTrue } from '@utils';
import { dictionary } from '../../utils';
import ServiceItems from '../../../components/ServiceItems';
import TaxUnitprice from '../TaxUnitprice';
import ServicePeriods from '../ServicePeriods';

const { MonthPicker } = DatePicker;

export default function({
  tableData,
  serviceItemsList,
  handleAddRow,
  handleDeleteRow,
  handleServiceItemChange,
  handleStartDateChange,
  handleEndDateChange,
  handleSettlementChange,
  handleUnitPriceChange,
  handleServicePeriodNumChange,
  handleMoneyChange,
  tableSumMoney,
  isCustomerIdSelected,
}) {
  const userAuth = pubData.get('authority');
  const style = { width: '100%' };
  // 如果服务项目没有选择，其他单元格全部为空
  const handleEmptyCell = ({ record, content }) => (record.serviceItemId ? content : '');

  return [
    {
      width: 30,
      dataIndex: 'operations',
      className: 'table-cell-pre',
      align: 'center',
      render: (value, record, index) => (
        <div className="table-cell-toggle">
          <LinkButton onClick={() => handleAddRow({ value, record, index })}>
            <Icon type="plus-circle" />
          </LinkButton>
          <LinkButton onClick={() => handleDeleteRow({ value, record, index })}>
            <Icon type="close-circle" />
          </LinkButton>
        </div>
      ),
    },
    {
      title: '服务项目',
      dataIndex: 'serviceItemId',
      align: 'center',
      total: '合计',
      totalStyle: { textAlign: 'left', padding: 0 },
      render: (value, record, index) => (
        <ServiceItems
          showArrow={false}
          disabled={!isCustomerIdSelected}
          dataSource={serviceItemsList}
          getSelectNodeProps={(item) => ({
            value: item.chargingItemId,
            name: item.itemName,
            disabled: tableData
              .map((v) => v.serviceItemId)
              .filter(Boolean)
              .includes(item.chargingItemId),
          })}
          style={style}
          value={isTrue(value, 0) ? `${value}` : undefined}
          onChange={(...args) => handleServiceItemChange({ value, record, index }, ...args)}
        />
      ),
    },
    {
      title: '服务类型',
      dataIndex: 'serviceTypeName',
      align: 'center',
      render: (value, record, index) => handleEmptyCell({ value, record, index, content: value }),
    },
    {
      title: '含税单价（元）',
      dataIndex: 'unitPriceContainTax',
      align: 'center',
      render: (value, record, index) =>
        handleEmptyCell({
          value,
          record,
          index,
          content: (
            <TaxUnitprice
              placeholder="0.00"
              disableSelect={!record.isCycle}
              style={style}
              value={{ input: record.unitPriceContainTax, select: record.unitPrice }}
              onChange={(...args) => handleUnitPriceChange({ value, record, index }, ...args)}
            />
          ),
        }),
    },
    {
      title: '开始日期',
      dataIndex: 'startDate',
      align: 'center',
      render: (value, record, index) => {
        const Picker = record.isCycle ? MonthPicker : DatePicker;
        const format = record.isCycle ? 'YYYY-MM' : 'YYYY-MM-DD';
        const { serviceItemDates } = record;
        const disabledDate = (startValue) => {
          // 需要排除掉同客户同个服务项目其他应收单已经选了的日期
          let result = false;
          if (!startValue) {
            return false;
          }
          const sValue = startValue.format(format).valueOf();
          if (record.endDate) {
            result = result || sValue > record.endDate.format(format).valueOf();
          }
          if (serviceItemDates && Array.isArray(serviceItemDates)) {
            serviceItemDates.forEach((item) => {
              if (item.startDate && item.endDate) {
                result =
                  result ||
                  (sValue >=
                    moment(item.startDate, 'X')
                      .format(format)
                      .valueOf() &&
                    sValue <=
                      moment(item.endDate, 'X')
                        .format(format)
                        .valueOf());
              }
            });
          }
          return result;
        };
        return handleEmptyCell({
          value,
          record,
          index,
          content: (
            <Picker
              placeholder={`${record.isCycle ? '请选择' : '-'}`}
              allowClear={false}
              style={style}
              disabled={!record.isCycle}
              disabledDate={disabledDate}
              value={value ? moment(value, 'X') : undefined}
              onChange={(...args) => handleStartDateChange({ value, record, index }, ...args)}
            />
          ),
        });
      },
    },
    {
      title: '结束日期',
      dataIndex: 'endDate',
      align: 'center',
      render: (value, record, index) => {
        const Picker = record.isCycle ? MonthPicker : DatePicker;
        const format = record.isCycle ? 'YYYY-MM' : 'YYYY-MM-DD';
        const { serviceItemDates } = record;
        const disabledDate = (endValue) => {
          // 需要排除掉同客户同个服务项目其他应收单已经选了的日期
          let result = false;
          if (!endValue) {
            return false;
          }
          const eValue = endValue.format(format).valueOf();
          if (record.startDate) {
            result = result || eValue < record.startDate.format(format).valueOf();
          }
          if (serviceItemDates && Array.isArray(serviceItemDates)) {
            serviceItemDates.forEach((item) => {
              if (item.startDate && item.endDate) {
                result =
                  result ||
                  (eValue >=
                    moment(item.startDate, 'X')
                      .format(format)
                      .valueOf() &&
                    eValue <=
                      moment(item.endDate, 'X')
                        .format(format)
                        .valueOf());
              }
            });
          }
          return result;
        };
        return handleEmptyCell({
          value,
          record,
          index,
          content: (
            <Picker
              placeholder="请选择"
              allowClear={false}
              style={style}
              disabledDate={disabledDate}
              value={value ? moment(value, 'X') : undefined}
              onChange={(...args) => handleEndDateChange({ value, record, index }, ...args)}
            />
          ),
        });
      },
    },
    {
      title: '服务期数（月）',
      dataIndex: 'servicePeriodNum',
      align: 'center',
      render: (value, record, index) =>
        handleEmptyCell({
          value,
          record,
          index,
          content: record.isCycle ? (
            <ServicePeriods
              style={style}
              value={{ first: record.servicePeriodNum, second: record.freePeriodNum }}
              onChange={(...args) =>
                handleServicePeriodNumChange({ value, record, index }, ...args)
              }
            />
          ) : (
            <NumberInput disabled placeholder="-" />
          ),
        }),
    },
    {
      title: '结算方式',
      dataIndex: 'settlementMethod',
      align: 'center',
      render: (value, record, index) =>
        handleEmptyCell({
          value,
          record,
          index,
          content: (
            <AntdSelect
              placeholder="请选择"
              showSearch={false}
              disabled={!record.isCycle || record.unitPrice === 0}
              style={style}
              value={value}
              dataSource={dictionary.settlementMethod.list}
              onChange={(...args) => handleSettlementChange({ value, record, index }, ...args)}
            />
          ),
        }),
    },
    {
      title: '金额（元）',
      dataIndex: 'money',
      align: 'right',
      total: tableSumMoney || '',
      totalStyle: {
        padding: '0 20px',
      },
      render: (value, record, index) =>
        handleEmptyCell({
          value,
          record,
          index,
          content: (
            <NumberInput
              placeholder="0.00"
              style={style}
              value={value}
              onChange={(...args) => handleMoneyChange({ value, record, index }, ...args)}
            />
          ),
        }),
    },
  ];
}
