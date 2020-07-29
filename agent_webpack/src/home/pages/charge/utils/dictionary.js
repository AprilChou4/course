/**
 * @func 数据字典
 */

const getData = (data) => {
  const datas = data;
  datas.map = {};
  datas.list.forEach((ele) => {
    datas.map[ele.value] = ele.name;
  });
  return datas;
};

// 收款单-源单类型
const sourceBillType = {
  title: '源单类型',
  list: [
    {
      name: '应收单',
      value: 1,
    },
    {
      name: '无',
      value: 0,
    },
  ],
};

// 应收单-源单类型
const receiveSourceBillType = {
  title: '源单类型',
  list: [
    {
      name: '合同',
      value: 1,
    },
    {
      name: '无',
      value: 0,
    },
  ],
};
// 收款状态 0-未收款 1-已收款 2-收款中
const receiveStatus = {
  title: '收款状态 ',
  list: [
    {
      name: '未收款',
      value: 0,
    },
    {
      name: '已收款',
      value: 1,
    },
    {
      name: '收款中',
      value: 2,
    },
  ],
};

export default {
  sourceBillType: getData(sourceBillType),
  receiveSourceBillType: getData(receiveSourceBillType),
  receiveStatus: getData(receiveStatus),
};
