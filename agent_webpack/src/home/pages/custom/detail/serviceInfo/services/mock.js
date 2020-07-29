export default {
  // 获取服务信息详情
  getServiceInfoDetail() {
    return {
      data: {
        customerContactList: [
          {
            creator: '对方水电费',
            customerContactId: 0,
            edit: true,
            email: '',
            job: '',
            normal: true,
            phone: '',
            qq: '1575280317',
            realName: '第三方',
            remark: '',
            sex: 0,
            telephone: '18766678822',
            userId: '',
          },
          {
            creator: '反反复复',
            customerContactId: 1,
            edit: true,
            email: '',
            job: '',
            normal: true,
            phone: '',
            qq: '1575280317',
            realName: '大声道',
            remark: '',
            sex: 0,
            telephone: '18766678821',
            userId: '',
          },
        ],
        customerId: '',
        customerLevel: 0,
        customerServiceRelationList: [
          {
            companyServiceTypeId: 0,
            companyServiceTypeValue: 0,
            customerId: '',
            edit: true,
            serviceTypeName: '',
          },
        ],
        customerSource: 0,
        customerSourceRelationInfo: '',
        documentNum: '',
        remark: '',
        ticketObtainAddress: '',
        ticketPicker: '',
        ticketType: 0,
      },
      eid: '',
      message: '',
      status: 200,
    };
  },

  updateServiceInfo() {
    return {
      "data": {},
      "eid": "",
      "message": "",
      "status": 200
    }
  },
   // 获取客户等级
  getCustomerLevelList() {
    return {
      data: [
        {
          name: '等级1', // 服务类型id
          value: '1', // 服务类型名称
        },
        {
          name: '等级2', // 服务类型id
          value: '2', // 服务类型名称
        },
      ],
      eid: '',
      message: '',
      status: 200,
    };
  },
  // 查询客户自定义列业务类型信息
  getServiceType() {
    return {
      data: [
        {
          companyServiceTypeId: '0', // 服务类型id
          companyServiceTypeName: '工商注册', // 服务类型名称
          companyServiceTypeValue: 0, // 服务类型值
        },
        {
          companyServiceTypeId: '0', // 服务类型id
          companyServiceTypeName: '代理申报', // 服务类型名称
          companyServiceTypeValue: 3, // 服务类型值
        },
      ],
      eid: '',
      message: '',
      status: 200,
    };
  },
  // 查询记账会计集合
  getBookkeep() {
    return {
      data: [
        {
          realName: '我是记账会计',
          staffId: 'B8959E531CD94B5AB7A9DD3622C51C8E',
        },
        {
          realName: '我是记账会计2',
          staffId: '297E8DCD5508418E9890A3FD489BF77C',
        },
        {
          realName: '我是记账会计3',
          staffId: '84C2CF115BC34482B3E8A4EAA02893AD',
        },
      ],
      eid: '',
      message: '',
      status: 200,
    };
  },
  // 查询派工角色信息 角色类型（int）：会计助理2(accountAssistant)， 报税会计4(taxReporter)，开票员3(drawer)，客户顾问5(customAdviser)
  getRoletypeList() {
    return {
      data: [
        {
          roleType: 2,
          treeList: [
            {
              children: [
                {
                  children: [],
                  code: '',
                  isParent: false,
                  name: '会计助理2',
                  value: '2',
                },
                {
                  children: [],
                  code: '',
                  isParent: false,
                  name: '会计助理3',
                  value: '3',
                },
              ],
              code: '',
              isParent: true,
              name: '我是会计助理部门',
              value: '1',
            },
          ],
        },

        {
          roleType: 4,
          treeList: [
            {
              children: [
                {
                  children: [],
                  code: '',
                  isParent: false,
                  name: '我是员工',
                  value: '2',
                },
              ],
              code: '',
              isParent: true,
              name: '我是报税会计部门',
              value: '1',
            },
          ],
        },

        {
          roleType: 3,
          treeList: [
            {
              children: [
                {
                  children: [],
                  code: '2',
                  isParent: false,
                  name: '我是开票员工2',
                  value: '2',
                },
                {
                  children: [],
                  code: '3',
                  isParent: false,
                  name: '我是开票员工3',
                  value: '3',
                },
              ],
              code: '1',
              isParent: true,
              name: '我是开票员部门',
              value: '1',
            },
          ],
        },

        {
          roleType: 5,
          treeList: [
            {
              children: [
                {
                  children: [],
                  code: '',
                  isParent: false,
                  name: '我是客户顾问',
                  value: '2',
                },
              ],
              code: '',
              isParent: true,
              name: '我是客户顾问部门',
              value: '1',
            },
          ],
        },
      ],
      eid: '',
      message: '',
      status: 200,
    };
  },
};
