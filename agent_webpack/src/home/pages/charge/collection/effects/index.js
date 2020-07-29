import { message } from 'antd';
import { router } from 'nuomi';
import { get } from '@utils';
import services from '../services';
import { initialForm, genInitDataSource, getUid, getNextStatus, calcTotalMoney } from '../utils';

export default {
  // 新增收款单 isContinue=true代表是 保存+新增, false是保存+查看
  async $addCollection({ params, isContinue }) {
    const { formValues } = this.getState();
    const finalParams = {
      ...params,
      shouldReceiveId: formValues.shouldReceiveId,
    };
    const data = await services.addCollection(finalParams, {
      loading: '正在保存...',
    });
    message.success('保存成功');
    if (isContinue) {
      // 初始化form表单
      this.$initForm(true);
    } else {
      this.updateState({
        status: 2,
        receiveBillId: data,
        receiveBillSubjectItem: [],
      });
      this.$getDetail(data);
    }
  },

  // 删除收款单
  async $deleteCollection() {
    const { receiveBillId } = this.getState();
    await services.deleteOne({ receiveBillIds: [receiveBillId] });
    message.success('删除成功');
    this.$initForm(true);
  },

  // 更新收款单
  async $updateCollection({ params, isContinue }) {
    const { receiveBillId } = this.getState();
    await services.updateOne(
      { ...params, receiveBillId },
      {
        loading: '正在更新...',
      },
    );
    message.success('保存成功');
    if (isContinue) {
      // 初始化form表单
      this.$initForm(true);
    } else {
      const { isViewPage } = this.getState();
      this.updateState({
        status: isViewPage ? 4 : 2,
      });
      this.$getDetail(receiveBillId);
    }
  },

  // 查看收款单
  async $getDetail(receiveBillId) {
    const data = await services.getDetail(
      { receiveBillId },
      {
        loading: '正在获取收款单信息...',
      },
    );
    const { deptId, sourceBillNo, receiveBillItems } = data;
    // 有明细计算合计
    const totalMoney = calcTotalMoney(receiveBillItems);
    // 根据部门id请求业务员
    this.$getStaffByDeptId(deptId);
    // 查找收款账号对应的收款方式
    const { receiptTypeList, receiptAccountMap } = this.getState();
    let receiptAccountList = [];
    // debugger;
    console.log('debugger:', receiptAccountMap, data.receiptTypeAccountId);
    if (data.receiptTypeAccountId && receiptAccountMap[data.receiptTypeAccountId]) {
      const currentType = receiptTypeList.find(
        (it) => it.receiptTypeId === receiptAccountMap[data.receiptTypeAccountId],
      ) || { receiptTypeAccounts: [] };
      receiptAccountList = currentType.receiptTypeAccounts;
    }

    this.updateState({
      formValues: { ...data, receiptType: receiptAccountMap[data.receiptTypeAccountId] },
      isReference: Boolean(sourceBillNo),
      dataSource: genInitDataSource(receiveBillItems),
      receiptAccountList,
      // 合计
      totalMoney,
    });
    // hack!
    setTimeout(() => {
      const { form } = this.getState();
      form.resetFields && form.resetFields();
    });
  },

  // 根据部门ID获取业务员列表
  async $getStaffByDeptId(deptId) {
    const data = await services.getStaff({ deptId });
    this.updateState({
      businessStaffList: data,
    });
  },

  // 获取收款单编号
  async $getReceiptNo() {
    const data = await services.getReceiptNo({
      receiveType: 1,
    });
    this.dispatch({
      type: 'updateFormValues',
      payload: {
        receiptNo: data,
      },
    });
  },

  /**
   * 初始化form表单
   * isNew==true代表新增一条新的，需要重新获取编号
   * isNew==false代表修改收款单或者参应收单不需要重新获取编号
   * @param {*} isNew
   */
  async $initForm(isNew) {
    const { formValues, receiveBillId, status, tableForm } = this.getState();
    this.updateState({
      formValues: { ...initialForm, receiptNo: isNew ? undefined : formValues.receiptNo },
      status: isNew ? 0 : status, // 新增时初始化，其他情况下不变
      isEdit: false,
      dataSource: genInitDataSource([]),
      receiveBillId: isNew ? '' : receiveBillId,
      receiveBillSubjectItem: [],
      totalMoney: {},
    });
    tableForm.resetFields();
    if (isNew) {
      await this.$getReceiptNo();
    }
  },

  // 获取最大使用预收
  async $getMaxMoney(customerId) {
    const { dataSource } = this.getState();
    const data = await services.getMaxMoney({ customerId });
    this.dispatch({
      type: 'updateState',
      payload: {
        maxPreMoney: data,
        // 最大预收改变后，置空添加过使用的预收
        dataSource: dataSource.map((it) => ({ ...it, userPreReceiptMoney: undefined })),
      },
    });
  },

  // 获取收款单编号
  async $getYsdList(curtomerId) {
    const data = await services.getYsdList({ curtomerId });
    this.updateState({
      ysdList: data,
    });
  },

  // 展示参照应收单弹窗
  async $showReferenceModal() {
    this.$initForm();
    this.updateState({
      isReference: false,
    });
    this.$getCustomerBillList();
  },

  // 清空参照应收单
  async $clearReference() {
    this.$initForm();
    this.updateState({
      isReference: false,
    });
  },

  // 获取客户对应的应收单
  async $getCustomerBillList() {
    const data = await services.getCustomerBillList({ isShouldReceiveBill: 1 });
    this.updateState({
      referenceCustomerList: data || [],
      isShowModal: true,
    });
  },

  // 获取收款计划明细表
  async $getplanDetailList(shouldReceiveId) {
    const data = await services.getplanDetailList({ shouldReceiveId });
    this.updateState({
      skjhList: data.list.map((item, index) => ({ ...item, index })),
    });
  },

  // 改变status、isEdit
  changeStatus() {
    const { status } = this.getState();
    this.updateState({
      isEdit: true,
      status: getNextStatus(status),
    });
  },

  // 获取收款计划明细表 ugly!
  async $refrenceYsd(params) {
    // console.log('refrenceYsd params', params);
    const data = await services.refrenceYsd(params);
    const {
      shouldReceiveId,
      srbNo,
      customerId,
      deptId,
      businessStaffId,
      totalShouldReceiveMoney,
      customerPreReceiveMoney,
      itemDetails,
    } = data;
    this.dispatch({
      type: 'updateFormValues',
      payload: {
        sourceBillType: 1,
        sourceBillNo: srbNo,
        srbNo,
        customerId,
        deptId,
        businessStaffId,
        shouldTotalMoney: totalShouldReceiveMoney,
        shouldReceiveId,
      },
    });
    const { status, dataSource } = this.getState();
    // 判断应收单是否只填表头, 未填明细
    // const isPlanList = itemDetails.some((it) => !it.serviceItemId);
    let list = dataSource;
    const receiveBillSubjectItem = [];
    // if (isPlanList) {
    //   receiveBillSubjectItem = itemDetails.map((it) => ({
    //     shouldReceiveItemId: it.id,
    //     shouldMoney: it.shouldReceiveMoney,
    //   }));
    // } else {
    list = itemDetails.map((item) => ({
      ...item,
      shouldMoney: item.shouldReceiveMoney,
      id: getUid(), // 表格唯一id，
      shouldReceiveItemId: item.id,
    }));
    // }
    this.updateState({
      isShowModal: false,
      skjhList: [],
      isEdit: true,
      isReference: true,
      maxPreMoney: customerPreReceiveMoney,
      status: getNextStatus(status),
      dataSource: genInitDataSource(list),
      receiveBillSubjectItem, // 计划表数据，传给后端计算
    });
    // 请求成功
    return true;
  },

  async initList() {
    // 获取收款人列表
    this.$getStaffList();
    // 获取客户列表
    this.$getCustomerList();
    // 获取服务项目列表
    this.$getChargingList();
    // 获取收款方式列表
    this.$getReceiptTypeList();
  },

  async initData() {
    const { id } = router.location().query || {};
    if (id) {
      // 代表是查看收款单
      await this.$getDetail(id);
      this.updateState({
        status: 4,
        isViewPage: true,
        receiveBillId: id,
      });
    } else {
      // 代表是新增收款单，需要获取新的单据编号
      await this.$getReceiptNo();
      // 默认生成3条表格数据源
      this.updateState({
        dataSource: genInitDataSource([]),
      });
    }
  },

  // 获取收款人列表
  async $getStaffList() {
    const data = await services.getStaff();
    this.updateState({
      receiptStaffList: data || [],
      businessStaffList: data || [],
    });
  },

  // 获取客户列表
  async $getCustomerList() {
    const data = await services.getCustomerBillList({ isShouldReceiveBill: 0 });
    this.updateState({
      customerList: data || [],
    });
  },

  // 获取服务项目列表
  async $getChargingList() {
    const data = await services.getCharging();
    const list = data.reduce((a, c) => [...a, ...c.chargingItemList], []);
    const serviceItemMap = list.reduce((a, c) => ({ ...a, [c.chargingItemId]: c.serviceName }), {});
    this.updateState({
      serviceList: list || [],
      serviceItemMap,
    });
  },

  // 获取收款方式列表
  async $getReceiptTypeList() {
    const data = await services.getReceiptType();
    const receiptTypeList = get(data, 'receiptList', []);
    const accountMap = {};
    // 先只计算一次
    receiptTypeList.forEach((type) => {
      type.receiptTypeAccounts.forEach((account) => {
        accountMap[account.receiptTypeAccountId] = account.receiptTypeId;
      });
    });
    this.updateState({
      receiptTypeList,
      receiptAccountMap: accountMap,
    });
  },
};
