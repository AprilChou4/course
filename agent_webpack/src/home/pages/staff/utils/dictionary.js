/**
 * @func 数据字典
 */

const getData = (data) => {
  const map = {};
  data.list.forEach(({ value, name }) => {
    map[value] = name;
  });
  return { ...data, map };
};

const staffStatus = {
  title: '员工状态',
  list: [
    {
      value: '-1',
      name: '未激活',
    },
    {
      value: '0',
      name: '已启用',
    },
    {
      value: '1',
      name: '已禁用',
    },
  ],
};

const staffModalType = {
  title: '员工弹窗类型',
  list: [
    {
      value: '0',
      name: '新增员工',
    },
    {
      value: '1',
      name: '修改员工信息',
    },
    {
      value: '2',
      name: '同意审批',
    },
    {
      value: '3',
      name: '修改员工信息',
    },
  ],
};

// 角色类型 0添加人,1记账会计,2会计助理，4报税会计 ，3开票员，5客户顾问
const assignType = {
  title: '派工类型',
  list: [
    {
      value: '0',
      name: '添加人',
    },
    {
      value: '1',
      name: '记账任务',
    },
    {
      value: '2',
      name: '会计助理',
    },
    {
      value: '3',
      name: '开票任务',
    },
    {
      value: '4',
      name: '报税任务',
    },
    {
      value: '5',
      name: '顾问任务',
    },
  ],
};

const approveFailureReasonType = {
  title: '审核失败原因',
  list: [
    {
      value: '5',
      name: '审核未通过',
    },
    {
      value: '6',
      name: '申请人撤回',
    },
    {
      value: '7',
      name: '未激活撤回',
    },
  ],
};

export default {
  staffStatus: getData(staffStatus),
  staffModalType: getData(staffModalType),
  assignType: getData(assignType),
  approveFailureReasonType: getData(approveFailureReasonType),
};
