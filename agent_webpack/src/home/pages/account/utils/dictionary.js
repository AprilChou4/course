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

const schedules = {
  title: '账套进度',
  list: [
    {
      name: '未开始',
      value: '1',
    },
    {
      name: '理票中',
      value: '2',
    },
    {
      name: '理票完成',
      value: '3',
    },
    {
      name: '记账中',
      value: '4',
    },
    {
      name: '待审核',
      value: '5',
    },
    {
      name: '待结账',
      value: '6',
    },
    {
      name: '已结账',
      value: '7',
    },
  ],
};

const taxType = {
  title: '报税类型',
  list: [
    {
      name: '一般纳税人',
      value: '0',
    },
    {
      name: '小规模纳税人',
      value: '1',
    },
  ],
};

const reviewStatus = {
  title: '审核状态',
  list: [
    {
      name: '未审核',
      value: '0',
    },
    {
      name: '已审核',
      value: '1',
    },
    {
      name: '无凭证',
      value: '-1',
    },
  ],
};

const checkStatus = {
  title: '风险检测状态',
  list: [
    {
      name: '未检测',
      value: '0',
    },
    {
      name: '已通过',
      value: '1',
    },
    {
      name: '低风险',
      value: '2',
    },
    {
      name: '高风险',
      value: '3',
    },
  ],
};

const isCheckOut = {
  title: '结账状态',
  list: [
    {
      name: '未结账',
      value: '0',
    },
    {
      name: '已结账',
      value: '1',
    },
  ],
};

const businessPattern = {
  title: '业务形态',
  list: [
    {
      name: '经典包干模式',
      value: '0',
    },
    {
      name: '会计工厂模式',
      value: '1',
    },
  ],
};

const isTransfer = {
  title: '交接状态',
  list: [
    {
      name: '未交接',
      value: '0',
    },
    {
      name: '交接中',
      value: '1',
    },
  ],
};

export default {
  schedules: getData(schedules),
  taxType: getData(taxType),
  reviewStatus: getData(reviewStatus),
  isCheckOut: getData(isCheckOut),
  businessPattern: getData(businessPattern),
  checkStatus: getData(checkStatus),
  isTransfer: getData(isTransfer),
};
