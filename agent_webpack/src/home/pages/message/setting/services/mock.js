export default {
  // getTemplateList() {
  //   return {
  //     status: '200',
  //     data: [
  //       {
  //         id: '179D7B4AAA9DB57983BF6BCC871969E6',
  //         title: '消息主题最多最多最多就十五个字',
  //         content:
  //           '亲爱的客户您好！临近报税期节点，请尽快核对报税数据，如近日无反馈异议，我们会在下周一进行集中申报请务必重视！',
  //         type: 0,
  //         edit_time: '2019-04-19 13:23:20',
  //         edit_user: '吴亦水',
  //       },
  //       {
  //         id: '179D7B49DB574BF983BF6BCC871969E6',
  //         title: '票据及时寄送',
  //         content:
  //           '您好！请尽快将贵公司（***<font color="red"><i>（客户名称）</i></font>）本月发生的各类票据寄送给我们。如有疑问，可随时与我们联系。感谢您的配合，顺祝商祺！',
  //         type: 1,
  //         send_time: '每月X日X时 /  X年X月X日X时',
  //       },
  //       {
  //         id: '179D7B49DB574BF983BF6BCC89S69E6',
  //         title: '税金及时确认',
  //         content:
  //           '您好！贵公司（***<font color="red"><i>（客户名称）</i></font>）***月<font color="red"><i>（系统自动带出发送时间所在自然月）</i></font>应报税金额已出具，应报税总额***元<font color="red"><i>（系统自动带出税种总额）</i></font>，其中***<font color="red"><i>（系统自动带出金额不为0的税种名称及对应金额）</i></font>税X元，您可以在诺言APP端查看您的报税数据。请您及时确认税额，如有疑问，请及时与我们联系。感谢您的配合，顺祝商祺！',
  //         type: 1,
  //         send_time: '每月X日X时 /  X年X月X日X时',
  //       },
  //     ],
  //   };
  // },
  getGroupList() {
    return {
      status: 200,
      data: {
        customerGroups: [
          {
            groupName: '杭州地区客户',
            groupId: 1,
            groupType: 1,
            operator: '吴亦水',
            operatorTime: '1564641873656',
            customers: [
              { customerId: 1, customerName: '杭州市闪闪教育有限公司' },
              { customerId: 2, customerName: '杭州康迪事业有限公司' },
              { customerId: 3, customerName: '杭州有略商务咨询有限公司' },
              { customerId: 4, customerName: '杭州市电子商务有限公司' },
              { customerId: 5, customerName: '杭州市小马达达有限公司' },
            ],
          },
          {
            groupName: '上海重庆地区客户',
            groupId: 2,
            groupType: 1,
            operator: '吴亦水',
            operatorTime: '1564641873656',
            customers: [
              { customerId: 1, customerName: '上海市闪闪教育有限公司' },
              { customerId: 3, customerName: '上海有略商务咨询有限公司' },
              { customerId: 5, customerName: '上海市小马达达有限公司' },
              { customerId: 7, customerName: '重庆康迪事业有限公司' },
              { customerId: 8, customerName: '重庆有略商务咨询有限公司' },
              { customerId: 9, customerName: '重庆市电子商务有限公司' },
              { customerId: 10, customerName: '重庆市小马达达有限公司' },
            ],
          },
        ],
      },
    };
  },
  getBuiltInGroupList() {
    return {
      status: 200,
      data: {
        defaultGroups: [
          {
            classifyName: '纳税性质',
            type: 1,
            isSelected: 1,
            extendGroupValuelist: [
              { value: 1, name: '张丹丹' },
              { value: 2, name: '李小路' },
              { value: 3, name: '易洋千玺' },
              { value: 4, name: '王鲁鸣' },
              { value: 5, name: '王曦月' },
              { value: 6, name: '张明宇' },
              { value: 7, name: '吴亦水' },
            ],
          },
          {
            classifyName: '服务类型',
            type: 2,
            isSelected: 0,
            extendGroupValuelist: [
              { value: 8, name: '张丹丹' },
              { value: 9, name: '李小路' },
              { value: 10, name: '易洋千玺' },
              { value: 11, name: '王鲁鸣' },
              { value: 12, name: '王曦月' },
              { value: 13, name: '张明宇' },
              { value: 14, name: '吴亦水' },
            ],
          },
          {
            classifyName: '行业类型',
            type: 3,
            isSelected: 0,
            extendGroupValuelist: [
              { value: 15, name: '张丹丹' },
              { value: 25, name: '李小路' },
              { value: 35, name: '易洋千玺' },
              { value: 45, name: '王鲁鸣' },
              { value: 55, name: '王曦月' },
              { value: 65, name: '张明宇' },
              { value: 75, name: '吴亦水' },
            ],
          },
          {
            classifyName: '客户等级',
            type: 4,
            isSelected: 1,
            extendGroupValuelist: [
              { value: 16, name: '张丹丹' },
              { value: 26, name: '李小路' },
              { value: 36, name: '易洋千玺' },
              { value: 46, name: '王鲁鸣' },
              { value: 56, name: '王曦月' },
              { value: 66, name: '张明宇' },
              { value: 76, name: '吴亦水' },
            ],
          },
          {
            classifyName: '指派的记账会计',
            type: 5,
            isSelected: 0,
            extendGroupValuelist: [
              { value: 17, name: '张丹丹' },
              { value: 27, name: '李小路' },
              { value: 37, name: '易洋千玺' },
              { value: 47, name: '王鲁鸣' },
              { value: 57, name: '王曦月' },
              { value: 67, name: '张明宇' },
              { value: 77, name: '吴亦水' },
            ],
          },
          {
            classifyName: '指派的报税会计',
            type: 6,
            isSelected: 0,
            extendGroupValuelist: [
              { value: 18, name: '张丹丹' },
              { value: 28, name: '李小路' },
              { value: 38, name: '易洋千玺' },
              { value: 48, name: '王鲁鸣' },
              { value: 58, name: '王曦月' },
              { value: 68, name: '张明宇' },
              { value: 78, name: '吴亦水' },
            ],
          },
        ],
      },
    };
  },
  // editDefaultGroup() {
  //   return {
  //     status: 200,
  //     data: null,
  //   };
  // },
  // deleteGroup() {
  //   return {
  //     status: 200,
  //     data: null,
  //   };
  // },
  // addGroup() {
  //   return {
  //     status: 200,
  //     data: null,
  //   };
  // },
  // updateGroup() {
  //   return {
  //     status: 200,
  //     data: null,
  //   };
  // },
  // getCustomerList() {
  //   return {
  //     status: 200,
  //     data: {
  //       total: 20,
  //       customerList: [
  //         { customerId: 1, customerName: '上海市闪闪教育有限公司' },
  //         { customerId: 2, customerName: '上海康迪事业有限公司' },
  //         { customerId: 3, customerName: '上海有略商务咨询有限公司' },
  //         { customerId: 4, customerName: '上海市电子商务有限公司' },
  //         { customerId: 5, customerName: '上海市小马达达有限公司' },
  //         { customerId: 6, customerName: '重庆市闪闪教育有限公司' },
  //         { customerId: 7, customerName: '重庆康迪事业有限公司' },
  //         { customerId: 8, customerName: '重庆有略商务咨询有限公司' },
  //         { customerId: 9, customerName: '重庆市电子商务有限公司' },
  //         { customerId: 10, customerName: '重庆市小马达达有限公司' },
  //       ],
  //     },
  //   };
  // },
};
