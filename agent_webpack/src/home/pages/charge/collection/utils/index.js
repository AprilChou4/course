import { uniqueId } from 'lodash';

export const STORE_PREFIX = 'collection';
/**
 * 收款单明细表唯一ID
 */
export const getUid = () => uniqueId('change_collection_');

/**
 * 初始化的表单字段
 */
export const initialForm = {
  customerId: '',
  receiptNo: '',
  sourceBillType: 0,
  sourceBillNo: '',
  shouldReceiveId: '',
  totalReceiptMoney: '',
  receiptDate: '',
  receiptType: '',
  receiptTypeAccountId: '',
  receiptStaffId: '',
  deptId: '',
  shouldTotalMoney: '',
  freeMoney: '',
  preReceiptMoney: 0,
  userPreReceiptMoney: '',
  remark: '',
  srbNo: undefined,
  createBillStaffName: '',
  createBillDate: '', // eslint-disable-line
  receiveBillItems: [],
};

/**
 * 获取初始的表格源数据，不够3条补上空行
 * @param {Array} receiveBillItems 明细表
 */
export const genInitDataSource = (receiveBillItems = []) => {
  const remain = Math.max(0, 3 - receiveBillItems.length);
  const list = receiveBillItems.map((item) => ({ ...item, id: getUid() }));
  for (let i = 0; i < remain; i++) {
    list.push({
      id: getUid(),
    });
  }
  return list;
};

/**
 * 获取下一次按钮的状态
 * @param {Number} currentStatus 当前状态
 */
export const getNextStatus = (currentStatus) => {
  const status = currentStatus;
  const nextStatusMap = {
    0: 1,
    2: 3,
    4: 5,
  };
  return nextStatusMap[status] || status;
};

// 计算合计
export const calcTotalMoney = (list) => {
  return list.reduce(
    (a, c) => ({
      shouldTotalMoney: a.shouldTotalMoney + Number(c.shouldMoney || 0),
      totalReceiptMoney: a.totalReceiptMoney + Number(c.receiptMoney || 0),
      freeMoney: a.freeMoney + Number(c.freeMoney || 0),
      preReceiptMoney: a.preReceiptMoney + Number(c.preReceiptMoney || 0),
      userPreReceiptMoney: a.userPreReceiptMoney + Number(c.userPreReceiptMoney || 0),
    }),
    {
      shouldTotalMoney: 0,
      totalReceiptMoney: 0,
      freeMoney: 0,
      preReceiptMoney: 0,
      userPreReceiptMoney: 0,
    },
  );
};

// 客户名称 收款人 业务员 匹配不上显示名字，但提交时还是id
export const getInitialValue = (id, list, key, defaultVal, storeKey) => {
  const index = list.findIndex((it) => it[key] === id);
  if (index > -1) {
    localStorage.removeItem(`${STORE_PREFIX}_${storeKey}`);
    return id;
  }
  localStorage.setItem(`${STORE_PREFIX}_${storeKey}`, id);
  return defaultVal;
};

export default {};
