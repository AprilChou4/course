import React, { useEffect, useCallback, useMemo } from 'react';
import { connect } from 'nuomi';
import moment from 'moment';
import { AntdTable, TableFooter } from '@components';
import { get, isNil, isTrue } from '@utils';
import getColumns from './columns';

const unitToProce = {
  0: 1, // 次在计算上等于月
  1: 1,
  2: 3,
  4: 12,
};

const DataGride = ({
  form,
  tableData,
  tableRowKey,
  tableSumMoney,
  serviceItemsList,
  scroll,
  dispatch,
}) => {
  // console.log('tableData', tableData);
  // 更新status
  const handleTableDataChange = useCallback(() => {
    dispatch({
      type: 'updateStatusOnPageChange',
    });
  }, [dispatch]);

  // 服务项目改变（获取服务类型）
  const handleServiceItemChange = useCallback(
    async ({ record }, value, option) => {
      handleTableDataChange();
      const isCycle = get(option, 'props.dataref.isCycle') !== 0; // 是否是周期性项目
      const formSettlementMethod = form ? form.getFieldValue('settlementMethod') : undefined;

      const unitPrice = isCycle ? 1 : 0;
      const settlementMethod = isCycle ? formSettlementMethod : 0; // 如果选择的收费项目是非周期性的，则结算方式变成"次"，否则带出上面表单中的结算方式

      dispatch({
        type: 'updateTableData',
        payload: {
          record,
          changes: {
            isCycle, // 是否是周期性服务
            serviceItemId: value, // 服务项目
            serviceTypeName: isNil(value) ? '' : get(option, 'props.dataref.serviceName'), // 服务类型
            unitPrice, // 含税单价单位
            servicePeriodNum: undefined, // 服务期数
            settlementMethod, // 结算方式
            unitPriceContainTax: undefined,
            endDate: undefined,
            money: undefined,
          },
        },
      });

      // 限制开始日期、结束日期的可选范围
      const data = await dispatch({
        type: 'getServiceItemSamePeriod',
        payload: {
          serviceItemIds: [value],
        },
      });
      if (data && Array.isArray(data)) {
        const serviceItemDates = get(
          data.find((item) => `${item.serviceItemId}` === `${value}`),
          'serviceItemDates',
          [],
        );
        // 需要排除掉同客户同个服务项目其他应收单已经选了的日期
        const format = record.isCycle ? 'YYYY-MM' : 'YYYY-MM-DD';
        const disabledDate = (startValue) => {
          let result = false;
          if (!startValue) {
            return false;
          }
          const sValue = startValue.format(format).valueOf();
          if (record.endDate) {
            result =
              result ||
              startValue.format(format).valueOf() < record.endDate.format(format).valueOf();
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
        const formStartDate = form ? form.getFieldValue('startDate') : undefined;
        const startDate = isCycle && !disabledDate(formStartDate) ? formStartDate : undefined; // 开始时间。周期性项目带出表单的开始时间，非周期性项目置空且禁用

        dispatch({
          type: 'updateTableData',
          payload: {
            record,
            changes: {
              serviceItemDates,
              startDate, // 开始日期
            },
          },
        });
      }
      // 服务类型改变后，触发form的校验（需求：如果表格中存在服务类型，则上面的开始时间、结束时间、有效期数必填）
      // dispatch({
      //   type: 'formValidateFields',
      //   payload: {
      //     fields: ['validPeriodNum', 'startDate', 'endDate'],
      //   },
      // });
    },
    [dispatch, form, handleTableDataChange],
  );

  // 服务期数改变后计算金额
  const calcMoneyOnServicePeriodChange = useCallback(
    (servicePeriodNum, record) =>
      isTrue(record.unitPriceContainTax, 0)
        ? Number(
            (record.unitPriceContainTax / (unitToProce[record.unitPrice] || 1)) *
              (servicePeriodNum || 0),
          ).toFixed(2)
        : undefined,
    [],
  );

  // 含税单价改变（计算金额）
  const handleUnitPriceChange = useCallback(
    ({ record }, value) => {
      // 含税单价 * 服务期数(不包括赠送) = 金额
      // 含税单价的单位 0-一次 1-月 2-季 4-年结
      const price = value.input;
      const unit = value.select;
      let money;
      if (!record.isCycle) {
        money = (Number(value.input) || 0).toFixed(2);
      } else if (isTrue(record.servicePeriodNum, 0)) {
        money = Number(
          (price / (unitToProce[unit] || 1)) * (unit === 0 ? 1 : record.servicePeriodNum || 0),
        ).toFixed(2);
      }
      // 含税单价单位选择次时，结算方式也变成次
      const settlementMethod = unit === 0 ? 0 : null;

      dispatch({
        type: 'updateTableData',
        payload: {
          record,
          changes: {
            unitPriceContainTax: price,
            unitPrice: unit,
            ...(isNil(money) ? {} : { money }),
            ...(isNil(settlementMethod) ? {} : { settlementMethod }),
          },
        },
      });
      handleTableDataChange();
    },
    [dispatch, handleTableDataChange],
  );

  // 开始日期改变（计算服务期数和金额）
  const handleStartDateChange = useCallback(
    ({ record }, value) => {
      const servicePeriodNum =
        value && record.endDate ? record.endDate.diff(value, 'month') + 1 : undefined;
      // const servicePeriodNum = number - (Number(record.freePeriodNum) || 0);
      const money = calcMoneyOnServicePeriodChange(servicePeriodNum, record);

      dispatch({
        type: 'updateTableData',
        payload: {
          record,
          changes: {
            startDate: value,
            freePeriodNum: undefined,
            ...(isNil(servicePeriodNum) ? {} : { servicePeriodNum }),
            ...(isNil(money) ? {} : { money }),
          },
        },
      });
      handleTableDataChange();
    },
    [calcMoneyOnServicePeriodChange, dispatch, handleTableDataChange],
  );

  // 结束日期改变（计算服务期数和金额）
  const handleEndDateChange = useCallback(
    ({ record }, value) => {
      const servicePeriodNum =
        record.isCycle && value && record.startDate
          ? value.diff(record.startDate, 'month') + 1
          : undefined;
      // const servicePeriodNum = number - (Number(record.freePeriodNum) || 0);
      const money = record.isCycle
        ? calcMoneyOnServicePeriodChange(servicePeriodNum, record)
        : (Number(record.unitPriceContainTax) || 0).toFixed(2);

      dispatch({
        type: 'updateTableData',
        payload: {
          record,
          changes: {
            endDate: value,
            freePeriodNum: undefined,
            ...(isNil(servicePeriodNum) ? {} : { servicePeriodNum }),
            ...(isNil(money) ? {} : { money }),
          },
        },
      });
      handleTableDataChange();
    },
    [calcMoneyOnServicePeriodChange, dispatch, handleTableDataChange],
  );

  // 结算方式改变
  const handleSettlementChange = useCallback(
    ({ record }, value) => {
      dispatch({
        type: 'updateTableData',
        payload: {
          record,
          changes: {
            settlementMethod: value,
          },
        },
      });
      handleTableDataChange();
    },
    [dispatch, handleTableDataChange],
  );

  // 服务期数改变(包括赠送的)（结束时间和计算金额）
  const handleServicePeriodNumChange = useCallback(
    ({ record }, value) => {
      // 含税单价 * 服务期数(不包括赠送) = 金额
      // 含税单价的单位 0-一次 1-月 2-季 4-年结
      const servicePeriodNum = value.first;
      const freePeriodNum = value.second;
      const number = (Number(servicePeriodNum) || 0) + (Number(freePeriodNum) || 0);
      // add前要使用moment包裹一下，否则会改变原始值
      const endDate =
        number && record.startDate
          ? moment(record.startDate).add(Number(number) - 1, 'month')
          : undefined;
      const money = calcMoneyOnServicePeriodChange(servicePeriodNum, record);

      dispatch({
        type: 'updateTableData',
        payload: {
          record,
          changes: {
            servicePeriodNum,
            freePeriodNum,
            endDate,
            ...(isNil(money) ? {} : { money }),
          },
        },
      });
      handleTableDataChange();
    },
    [calcMoneyOnServicePeriodChange, dispatch, handleTableDataChange],
  );

  // 金额改变（计算单价）
  const handleMoneyChange = useCallback(
    ({ record }, value) => {
      // 含税单价 * 服务期数(不包括赠送) = 金额
      // 含税单价的单位 0-一次 1-月 2-季 4-年结
      let unitPriceContainTax;
      if (isTrue(record.servicePeriodNum, 0)) {
        unitPriceContainTax = Number(
          (value / (record.servicePeriodNum || 0)) * (unitToProce[record.unitPrice] || 1),
        ).toFixed(2);
      }

      dispatch({
        type: 'updateTableData',
        payload: {
          record,
          changes: {
            money: value,
            ...(isNil(unitPriceContainTax) ? {} : { unitPriceContainTax }),
          },
        },
      });
      handleTableDataChange();
    },
    [dispatch, handleTableDataChange],
  );

  // td失焦点时保存
  // const handleTdChange = useCallback(
  //   (rowData, values, record, { dataIndex }) => {
  //     // console.log('handleTdChange', rowData, values, record, { dataIndex });
  //     dispatch({
  //       type: 'handleTdChange',
  //       payload: { rowData, values, dataIndex },
  //     });
  //   },
  //   [dispatch],
  // );

  // 点击新增行
  const handleAddRow = useCallback(
    (data) => {
      dispatch({
        type: 'addEmptyTr',
        payload: data,
      });
    },
    [dispatch],
  );

  // 点击删除行
  const handleDeleteRow = useCallback(
    (data) => {
      dispatch({
        type: 'deleteTr',
        payload: data,
      });
    },
    [dispatch],
  );

  // tableData改变时计算
  useEffect(() => {
    dispatch({
      type: 'calcOnTableDataChange',
    });
  }, [tableData, dispatch]);

  // 是否选择了客户名称
  const isCustomerIdSelected = !!(form && form.getFieldValue('customerId'));

  const columns = useMemo(
    () =>
      getColumns({
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
      }),
    [
      handleAddRow,
      handleDeleteRow,
      handleEndDateChange,
      handleMoneyChange,
      handleServiceItemChange,
      handleServicePeriodNumChange,
      handleSettlementChange,
      handleStartDateChange,
      handleUnitPriceChange,
      isCustomerIdSelected,
      serviceItemsList,
      tableData,
      tableSumMoney,
    ],
  );

  return (
    <AntdTable
      bordered
      type="editable"
      pagination={false}
      rowKey={tableRowKey}
      columns={columns}
      dataSource={tableData}
      scroll={scroll}
      footer={() => <TableFooter columns={columns} />}
      // idName={tableRowKey}
      // onTdChange={handleTdChange}
      // onSaveTr={handleSaveTr}
      // onAddTr={handleAddTr}
      // onDeleteTr={handleDeleteTr}
      // showAddIcon={(record) => true}
      // showDeleteIcon={(record, index) => tableData.length > 3}
    />
  );
};

export default connect(({ form, tableData, tableRowKey, tableSumMoney, serviceItemsList }) => ({
  form,
  tableData,
  tableRowKey,
  tableSumMoney,
  serviceItemsList,
}))(DataGride);
