import { message } from 'antd';
import { router } from 'nuomi';
import ShowConfirm from '@components/ShowConfirm';
import services from '../services';

export default {
  // 查询
  async $getTreeData() {
    const {
      customerLevelList,
      customerSourceList,
      ticketTypeList,
    } = await services.getArchivesList(); //  获取客户档案信息，来源，取票方式，等级
    const serviceTypeList = await services.getServiceType(); // 查询客户自定义列业务类型信息
    const bookeepers = await services.getBookkeep(); // 查询记账会计
    const staffList = await services.getStaffList(); // 查询未停用的员工集合
    const allEmployeeList = await services.getAllEmployeeList(); // 查询所有员工合集
    this.updateState({
      customerLevelList,
      customerSourceList,
      ticketTypeList,
      serviceTypeList,
      bookeepers,
      staffList,
      allEmployeeList,
    });
  },
  // 查询服务信息详情
  async $getServiceInfoDetail() {
    const {
      query: { customerId, isEdit },
    } = router.location();
    const data = await services.getServiceInfoDetail(
      {
        customerId,
      },
      {
        loading: '正在获取服务信息...',
      },
    ); // 获取服务信息详情
    const { customerServiceRelationList, customerContactList, assignVO, ...rest } = data;
    this.updateState({
      isEdit: Boolean(+isEdit),
      serviceInfoDetail: {
        ...rest,
        ...assignVO,
      },
      customerContactList,
      customerServiceRelationList,
      isContChange: false,
    });
  },
  // 修改服务信息详情
  async $updateServiceInfo(noRefresh) {
    try {
      const {
        serviceInfoDetail,
        customerContactList,
        customerServiceRelationList,
      } = this.getState();
      const {
        query: { customerId },
      } = router.location();
      await services.updateServiceInfo(
        {
          customerId,
          ...serviceInfoDetail,
          customerServiceRelationList,
          customerContactList,
        },
        {
          loading: '正在保存服务信息...',
        },
      );
      this.updateState({
        isContChange: false,
      });
      !noRefresh && this.$getServiceInfoDetail();
      message.success('服务信息保存成功');
    } catch (err) {
      message.error(err.message);
    }
  },
  // 查询会计助理=2、开票员=3、报税会计=4、客户顾问=5、
  async $getRoletypeList() {
    const data = await services.getRoletypeList();
    let accountAssistant = [];
    let taxReporter = [];
    let drawerList = [];
    let customAdviser = [];
    data.forEach((item) => {
      switch (item.roleType) {
        case 2:
          accountAssistant = item.treeList;
          break;
        case 4:
          taxReporter = item.treeList;
          break;
        case 3:
          drawerList = item.treeList;
          break;
        case 5:
          customAdviser = item.treeList;
          break;
        default:
          break;
      }
    });
    this.updateState({
      accountAssistant,
      taxReporter,
      drawerList,
      customAdviser,
    });
  },
  /**
   * 判断授权查账
   * @param {*} username
   */
  async $getUserByName(payload) {
    const { serviceInfoDetail } = this.getState();
    const { username, arr, index } = payload;
    const data = await services.getUserByName(
      { username },
      {
        status: {
          300: (err) => {
            ShowConfirm({
              title: err.message,
              type: 'warning',
            });
          },
        },
      },
    );
    arr[index].userId = data.userId;
    this.updateState({
      serviceInfoDetail: { ...serviceInfoDetail, customerContactList: arr },
    });
  },
  // 离开的时候
  async onLeave() {
    const { isEdit, isContChange } = this.getState();
    if (!isEdit || !isContChange) {
      return true;
    }
    return new Promise((resolve) => {
      ShowConfirm({
        title: '提示',
        content: '当前页面内容未保存，是否离开？',
        okText: '保存',
        cancelText: '离开',
        onOk: async () => {
          await this.$updateServiceInfo(true);
          resolve(true);
        },
        onCancel() {
          resolve(true);
        },
      });
    });
  },
  // 初始化数据
  async initData() {
    this.$getTreeData();
    this.$getRoletypeList();
    this.$getServiceInfoDetail();
  },
};
