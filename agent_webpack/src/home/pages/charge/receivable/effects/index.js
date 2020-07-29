// import produce from 'immer';
import { router } from 'nuomi';
import moment from 'moment';
import { message } from 'antd';
import globalServices from '@home/services';
import { ShowConfirm } from '@components';
import { get, omit, omitBy, isTrue, isNil, filter, map, flatMap } from '@utils';
import services from '../services';

// 周期性服务的必填字段
const cycleRequiredFields = [
  'serviceItemId',
  'serviceTypeName',
  'unitPriceContainTax',
  'unitPrice',
  'startDate',
  'endDate',
  'servicePeriodNum',
  'settlementMethod',
  'money',
];
// 非周期性服务的必填字段
const noCycleRequiredFields = [
  'serviceItemId',
  'serviceTypeName',
  'unitPriceContainTax',
  'unitPrice',
  'endDate',
  'settlementMethod',
  'money',
];

export default {
  // 获取index
  getRowIndex(record) {
    const { tableRowKey, tableData } = this.getState();
    return tableData.findIndex((item) => item[tableRowKey] === record[tableRowKey]);
  },

  async initData() {
    const { id } = router.location().query || {};
    if (id) {
      this.updateState({
        status: 4,
      });
      // await this.query();
      this.initViewReceivableInfo({ id });
    } else {
      // 代表是新增收款单，需要获取新的单据编号
      // this.query();
      this.initAddReceivable();
    }
  },

  // 查询
  async query() {
    // 获取客户列表
    this.$getCustomerList();
    // 获取业务员列表
    this.getBusinessStaffList();
    // 获取服务项目列表
    await this.$getServiceItems();
  },

  // 新增应收单初始化
  async initAddReceivable(payload = {}) {
    const { form, tableRowKey } = this.getState();
    // 重置form
    form && form.resetFields();
    // 重置redux
    this.updateState({
      tableRowKeyCounter: 2,
      tableData: [{ [tableRowKey]: 0 }, { [tableRowKey]: 1 }, { [tableRowKey]: 2 }],
      tableSumMoney: 0,
    });
    // form重新设置初始值
    this.getFormInitialValues(payload);
  },

  // 查看应收单初始化
  async initViewReceivableInfo(payload = {}) {
    const { id } = payload;
    // const { formInitialValues } = this.getState();
    // 代表是查看收款单
    await this.$getReceivableInfo({ id });
  },

  // 获取form初始值
  async getFormInitialValues(payload = {}) {
    this.updateState({
      formInitialValues: {
        ...payload,
        // 源单类型、源单据号 暂时默认为空
        sourceBillType: '-',
        sourceBillNo: '-',
        payType: 0, // 收款方式默认：预收
        settlementMethod: 1, // 结算方式默认：月结
        billDate: moment().startOf('day'), // 单据日期默认：当前日期
        startDate: moment().startOf('day'), // 开始日期默认：当前日期
      },
    });
    await this.getReceiptNo();
  },

  // 更新form初始值
  updateFormInitialValues(payload = {}) {
    const { init, ...rest } = payload;
    const { form, formInitialValues = {} } = this.getState();
    init && form && form.resetFields();
    this.updateState({
      formInitialValues: {
        ...(init ? {} : formInitialValues),
        ...rest,
      },
    });
  },

  // 页面值变化时更改status
  updateStatusOnPageChange() {
    const { status } = this.getState();
    const statusChangesMap = { 0: 1, 2: 3, 4: 5 };
    const newStatus = statusChangesMap[status];
    !isNil(newStatus) &&
      this.updateState({
        status: newStatus,
      });
  },

  // 点新增时重置应收单
  handleNewReceivable(payload = {}) {
    this.initAddReceivable();
    this.updateState({
      status: 0,
    });
  },

  // 获取单据编号
  async getReceiptNo() {
    const data = await globalServices.getReceiptNo({ receiveType: 0 });
    this.updateFormInitialValues({
      srbNo: data,
    });
  },

  // 获取客户列表
  async $getCustomerList() {
    const data = await globalServices.getCustomerBillNO({
      isShouldReceiveBill: 0,
    });
    this.updateState({
      customerList: data || [],
    });
  },

  // 获取服务项目列表
  async $getServiceItems(payload = {}) {
    const data = await globalServices.getServiceItems();
    this.updateState({
      serviceItemsList: flatMap(data || [], (item) => get(item, 'chargingItemList', [])),
    });
  },

  // 获取业务员列表
  async getBusinessStaffList(payload = {}) {
    const businessStaffList = await globalServices.getStaffList(payload);
    this.updateState({
      businessStaffList,
    });
  },

  // 保存应收单
  async $saveReceivable(payload = {}) {
    const { toNew } = payload;
    const { status, form, tableData, tableRowKey, tableSumMoney } = this.getState();
    const nextStatus = { 1: 2, 3: 2, 5: 4 }[status];
    if (!nextStatus) {
      return;
    }

    form &&
      form.validateFields(async (err, values) => {
        if (err) {
          return;
        }
        // 清除空值和无用值
        const formValues = omitBy(values, (val, key) => isNil(val, ''));

        let tableDataValidate = 1; // table的验证状态

        // console.log('tableData', tableData);
        const realTableData = tableData.filter((item) => {
          const requiredFields = item.isCycle ? cycleRequiredFields : noCycleRequiredFields; // 必填值的数量

          const realData = omit(item, [
            tableRowKey,
            'serviceTypeId',
            'freePeriodNum',
            'isCycle',
            'serviceItemDates',
          ]);
          // console.log('realData', realData);

          if (
            realData.serviceItemId &&
            requiredFields.some((val) => {
              const result = isNil(realData[val], '');
              if (result) {
                console.log('缺少必填字段:', val);
              }
              return result;
            })
          ) {
            tableDataValidate = 0;
          }

          return !!item.serviceItemId;
        });

        if (!tableDataValidate) {
          message.warning('服务项目不完整');
          return;
        }

        let earliestStartDate = formValues.startDate; // 最早的开始日期
        let lastEndDate = formValues.endDate; // 最晚的结束日期

        const shouldReceiveBillItems =
          realTableData && realTableData.length
            ? realTableData.map(({ itemOrder, serviceTypeId, startDate, endDate, ...rest }) => {
                const servicePeriodNum = rest.isCycle ? rest.servicePeriodNum : 0;
                const sDate = rest.isCycle ? startDate : endDate;
                if (sDate) {
                  earliestStartDate = moment.min(earliestStartDate, sDate);
                }
                if (endDate) {
                  lastEndDate = moment.max(lastEndDate, endDate);
                }
                return omitBy(
                  {
                    ...rest,
                    startDate: sDate ? sDate.format('X') : undefined,
                    endDate: endDate ? endDate.format('X') : undefined,
                    servicePeriodNum,
                  },
                  (val, key) => isNil(val, '') || ['isCycle', 'serviceItemDates'].includes(key),
                );
              })
            : undefined;

        // 提交前验证金额合计
        if (
          tableSumMoney &&
          Number(tableSumMoney).toFixed(2) !== Number(formValues.shouldReceiveMoney || 0).toFixed(2)
        ) {
          ShowConfirm({
            type: 'warning',
            title: '总金额与服务项目合计金额不相等，请检查。',
            okText: '确定',
          });
          return;
        }

        const formSettlementMethodCycle = formValues.settlementMethod !== 0;
        const startDate = formSettlementMethodCycle ? earliestStartDate : formValues.endDate;
        const endDate = lastEndDate;

        const params = {
          ...formValues,
          sourceBillType: isNil(formValues.sourceBillType, ['', '-'])
            ? undefined
            : formValues.sourceBillType,
          sourceBillNo: isNil(formValues.sourceBillNo, ['', '-'])
            ? undefined
            : formValues.sourceBillNo,
          billDate: formValues.billDate ? formValues.billDate.format('X') : undefined,
          startDate: startDate ? startDate.format('X') : undefined,
          endDate: endDate ? endDate.format('X') : undefined,
          validPeriodNum: formSettlementMethodCycle ? formValues.validPeriodNum : 0,
          shouldReceiveBillItems,
        };

        // console.log('form.startDate传参', startDate ? startDate.format('YYYY-MM-DD') : undefined);
        // console.log('form.endDate传参', endDate ? endDate.format('YYYY-MM-DD') : undefined);

        const res = await services[
          formValues.shouldReceiveId ? 'updateReceivable' : 'addReceivable'
        ](params, {
          loading: '正在保存...',
          successMsg: '保存成功',
        });
        if (toNew) {
          // 保存并新增
          this.handleNewReceivable();
        } else {
          this.updateState({
            status: nextStatus,
          });
          this.initViewReceivableInfo({ id: res || params.shouldReceiveId });
          // this.$getReceivableInfo({ id: res || params.shouldReceiveId });
        }
      });
  },

  // 查看应收单信息
  async $getReceivableInfo(payload = {}) {
    const { id } = payload;
    const { tableRowKey, tableRowKeyCounter, serviceItemsList } = this.getState();
    let newCount = tableRowKeyCounter;

    const { shouldReceiveBillItems, ...rest } = await services.getReceivableInfo(
      { shouldReceiveId: id },
      {
        loading: '正在查询应收单信息',
      },
    );
    // 获取业务员列表
    // this.getBusinessStaffList({ deptId: rest.deptId });

    // console.log(
    //   'form.startDate接收',
    //   rest.startDate ? moment(rest.startDate, 'X').format('YYYY-MM-DD') : undefined,
    // );
    // console.log(
    //   'form.endDate接收',
    //   rest.endDate ? moment(rest.endDate, 'X').format('YYYY-MM-DD') : undefined,
    // );

    this.updateFormInitialValues({
      ...rest,
      init: true,
      sourceBillType: isTrue(rest.sourceBillType, 0) ? rest.sourceBillType : '-',
      sourceBillNo: isTrue(rest.sourceBillNo, 0) ? rest.sourceBillNo : '-',
      billDate: rest.billDate ? moment(rest.billDate, 'X') : undefined,
      startDate: rest.startDate ? moment(rest.startDate, 'X') : undefined,
      endDate: rest.endDate ? moment(rest.endDate, 'X') : undefined,
    });

    const sourceTableData =
      shouldReceiveBillItems && Array.isArray(shouldReceiveBillItems) ? shouldReceiveBillItems : [];

    // 获取客户对应服务项目已经添加过的服务期间
    let serviceItemSamePeriod = [];
    if (sourceTableData.length) {
      serviceItemSamePeriod = await this.getServiceItemSamePeriod({
        serviceItemIds: sourceTableData.map((item) => item.serviceItemId),
      });
    }

    // 组装、处理数据
    const calcTableData = shouldReceiveBillItems.map((item) => {
      // 是否是周期性服务
      const isCycle =
        get(
          serviceItemsList.find((it) => `${it.chargingItemId}` === `${item.serviceItemId}`),
          'isCycle',
          1,
        ) !== 0;
      const startDate = isCycle ? item.startDate : undefined; // 周期性服务开始日期为空
      const servicePeriodNum = isCycle ? item.servicePeriodNum : undefined; // 周期性服务服务期数为空

      return {
        ...item,
        servicePeriodNum,
        startDate: startDate ? moment(startDate, 'X') : undefined,
        endDate: item.endDate ? moment(item.endDate, 'X') : undefined,
        // 客户对应服务项目已经添加过的服务期间
        serviceItemDates: get(
          serviceItemSamePeriod.find((it) => `${it.serviceItemId}` === `${item.serviceItemId}`),
          'serviceItemDates',
          [],
        ),
        isCycle,
      };
    });

    const restLength = 3 - calcTableData.length;
    for (let i = 1; restLength > 0 && i <= restLength; i++) {
      newCount += 1;
      calcTableData.push({
        [tableRowKey]: newCount,
      });
    }

    this.updateState({
      tableData: calcTableData,
      tableRowKeyCounter: newCount,
    });
  },

  // 删除应收单
  async $deleteReceivable(payload = {}) {
    const { formInitialValues } = this.getState();
    const shouldReceiveId = get(formInitialValues, 'shouldReceiveId');
    if (!shouldReceiveId) {
      return;
    }

    await services.deleteReceivable(
      { shouldReceiveIds: [shouldReceiveId] },
      { loading: '正在删除...', successMsg: '应收单已删除' },
    );
    this.handleNewReceivable();
  },

  // 表格新增行
  addEmptyTr(payload = {}) {
    const { record } = payload;
    const { tableRowKeyCounter, tableRowKey, tableData } = this.getState();
    const newCount = tableRowKeyCounter + 1;
    const index = this.getRowIndex(record);
    tableData.splice(index + 1, 0, { [tableRowKey]: newCount, unitPrice: 1 });
    this.updateState({
      tableData: [...tableData],
      tableRowKeyCounter: newCount,
    });
    this.updateStatusOnPageChange();
  },

  // 表格删除行
  deleteTr(payload = {}) {
    const { record } = payload;
    const { tableRowKey, tableData } = this.getState();

    // 保持最少3行，低于3行时只删除数据不删除行
    const newTableData = filter(
      map(tableData, (item) => {
        if (item[tableRowKey] === record[tableRowKey]) {
          if (tableData.length > 3) {
            return undefined;
          }
          return { [tableRowKey]: item[tableRowKey] };
        }
        return item;
      }),
      Boolean,
    );
    this.updateState({
      tableData: newTableData,
    });
    this.updateStatusOnPageChange();
    // this.formValidateFields({
    //   fields: ['validPeriodNum', 'startDate', 'endDate'],
    // });
  },

  // td失焦点时保存
  // handleTdChange(payload = {}) {
  //   const { rowData, dataIndex } = payload;
  //   const { tableData, form } = this.getState();

  //   if (['serviceItemId'].includes(dataIndex)) {
  //     setTimeout(() => {
  //       form.validateFields({ force: true });
  //     });
  //   }

  //   const index = this.getRowIndex(rowData);
  //   tableData.splice(index, 1, rowData);
  //   this.updateState({
  //     tableData: [...tableData],
  //   });
  //   this.updateStatusOnPageChange();
  // },

  // 更新tableData
  updateTableData(payload = {}) {
    const { record, changes } = payload;
    const { tableData, tableRowKey } = this.getState();

    const newTableData = tableData.map((item) =>
      item[tableRowKey] === record[tableRowKey] ? { ...item, ...changes } : item,
    );
    this.updateState({
      tableData: newTableData,
    });
  },

  // form强制验证
  formValidateFields(payload = {}) {
    const { fields } = payload;
    const { form } = this.getState();
    // 要加定时器 和 {force: true}
    setTimeout(() => {
      form && form.validateFields(...[fields, { force: true }].filter(Boolean));
    });
  },

  // 表格数据改变的时候计算数据
  calcOnTableDataChange(payload = {}) {
    const { tableData } = this.getState();
    // 计算表格footer里的金额合计
    const tableSumMoney = tableData.reduce(
      (preValue, curValue) => preValue + (Number(curValue.money) || 0),
      0,
    );
    this.updateState({
      tableSumMoney,
    });
  },

  // 获取客户对应服务项目已经添加过的服务期间
  async getServiceItemSamePeriod(payload = {}) {
    const { serviceItemIds } = payload;
    const { form } = this.getState();
    const { customerId } = form.getFieldsValue();
    if (!(serviceItemIds && customerId)) {
      return null;
    }
    const data = await services.getServiceItemSamePeriod({ customerId, serviceItemIds });
    return data;
  },

  // 更新form
  updateForm(payload = {}) {
    const { form } = payload;
    this.updateState({
      form,
    });
  },
};
