/**
 * @object 数据字典
 */

const getData = (params) => {
  const map = {};
  params.list.forEach(({ value, name, label, data }) => {
    map[value] = data || name || label;
  });
  return { ...params, map };
};

// 源单类型
const sourceBillType = {
  title: '源单类型',
  list: [
    {
      value: 0,
      name: '手动创建',
    },
    {
      value: 1,
      name: '合同',
    },
  ],
};

// 付款方式
const payType = {
  title: '员工状态',
  list: [
    {
      value: 0,
      label: '预收',
    },
    {
      value: 1,
      label: '后收',
    },
  ],
};

// 结算方式
const settlementMethod = {
  title: '结算方式',
  list: [
    {
      value: 1,
      name: '月结',
    },
    {
      value: 2,
      name: '季结',
    },
    {
      value: 3,
      name: '半年结',
    },
    {
      value: 4,
      name: '年结',
    },
    {
      value: 0,
      name: '次数结',
    },
  ],
};

// 含税单价的单位 0-一次 1-月 2-季 4-年结
const TaxPriceUnit = {
  title: '含税单价',
  list: [
    {
      value: 1,
      name: '月',
    },
    {
      value: 2,
      name: '季',
    },
    {
      value: 4,
      name: '年',
    },
    {
      value: 0,
      name: '次',
    },
  ],
};

// 6种页面状态：0（初始状态）、1（初始状态输入时）、2（点击保存后）、3（点击新增/保存并新增后）、4（查看状态）、5（查看状态输入后）
// 操作按钮：save（保存）、add(新增)、saveAdd（保存并新增）、delete（删除）
// 操作按钮对应的3种状态：0（正常）、1（禁用）、2（隐藏）  |   show: !==2，disabled: !==0
const statusData = {
  title: '页面状态对应的按钮状态',
  list: [
    // 初始状态
    {
      value: 0,
      data: {
        save: 1,
        add: 2,
        saveAdd: 1,
        delete: 2,
      },
    },
    // 初始状态输入时
    {
      value: 1,
      data: {
        save: 0,
        add: 2,
        saveAdd: 0,
        delete: 2,
      },
    },
    // 点击保存后
    {
      value: 2,
      data: {
        save: 1,
        add: 0,
        saveAdd: 2,
        delete: 0,
      },
    },
    // 保存后输入时
    {
      value: 3,
      data: {
        save: 0,
        add: 0,
        saveAdd: 2,
        delete: 0,
      },
    },
    // 查看状态
    {
      value: 4,
      data: {
        save: 1,
        add: 2,
        saveAdd: 2,
        delete: 2,
      },
    },
    // 查看状态输入后
    {
      value: 5,
      data: {
        save: 0,
        add: 2,
        saveAdd: 2,
        delete: 2,
      },
    },
  ],
};

export default {
  sourceBillType: getData(sourceBillType),
  payType: getData(payType),
  settlementMethod: getData(settlementMethod),
  TaxPriceUnit: getData(TaxPriceUnit),
  statusData: getData(statusData),
};
