import { message } from 'antd';
import { trim, uniq } from 'lodash';
import axios from 'axios';
import ShowConfirm from '@components/ShowConfirm';
import trackEvent from 'trackEvent';
import pubData from 'data';
import postMessageRouter from '@utils/postMessage';
import { progressModal } from '@components/HintModal';

import services from '../services';

export default {
  getQueryParam() {
    const { query, sorters } = this.getState();
    // 老项目跳转新项目客户管理的查询参数
    if (!window.clientParams) {
      return false;
    }
    const { vatType, ...rest } = window.clientParams || {};
    // 员工绩效跳转过来you纳税性质
    const vatTypeSorter = vatType || vatType === 0 ? { vatType } : {};
    this.updateState({
      query: {
        ...query,
        ...rest,
      },
      sorters: {
        ...sorters,
        ...vatTypeSorter,
      },
    });
  },
  // 服务中客户列表
  async $serviceCustomerList(payload = {}) {
    const { current, pageSize, query, sorters } = this.getState();
    const param = {
      current,
      pageSize,
      ...query,
      ...sorters,
      ...payload,
    };
    const { bookkeepingAccounting, order, isCreate, vatType, commissioner, headbookkeep } = param;
    // 合并头部和更多条件的记账会计
    param.bookkeepingAccounting = bookkeepingAccounting || [];
    param.bookkeepingAccounting = headbookkeep
      ? [...param.bookkeepingAccounting, headbookkeep]
      : param.bookkeepingAccounting;
    const data = await services.serviceCustomerList(param, {
      loading: '正在加载客户列表...',
    });

    const orderSorter = order ? { order } : {};
    const isCreateSorter = isCreate || isCreate === 0 ? { isCreate } : {};
    const vatTypeSorter = vatType || vatType === 0 ? { vatType } : {};
    const commissionerSorter = commissioner ? { commissioner } : {}; // 专管员姓名
    const headbookkeepSorter = headbookkeep ? { headbookkeep } : {}; // 头部记账会计
    this.updateState({
      dataSource: data.list,
      total: data.total,
      current: param.current,
      pageSize: param.pageSize,
      selectedRowKeys: [],
      selectedRows: [],
      sorters: {
        ...orderSorter,
        ...isCreateSorter,
        ...vatTypeSorter,
        ...commissionerSorter,
        ...headbookkeepSorter,
      },
    });
    window.clientParams = {};
  },

  // 查询客户自定义列表表头信息
  async $getHeaderColumn() {
    const data = await services.getHeaderColumn();
    this.updateState({
      columnSource: data,
    });
    return data;
  },

  /**
   * 修改客户自定义列表表头信息
   * @param {*array}  arr 表头列表
   */
  async $updateHeaderColumn(payload = {}) {
    const { customerHeaderRequestList } = payload;
    const data = await services.updateHeaderColumn(customerHeaderRequestList);
    message.success('自定义列表已保存');
    this.updateState({
      columnSource: payload.customerHeaderRequestList,
    });
    this.dispatch({
      type: '$serviceCustomerList',
    });
    return data;
  },

  // 查询派工角色信息
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
   *停止客户
   * @param {*array} customerIdList 客户id
   * @param {*string} stopReason 停止原因

   */
  async $stopCustomer(payload) {
    const { selectedRows, total, pageSize, current } = this.getState();
    const maxPage = Math.ceil((total - selectedRows.length) / pageSize) || 1;
    await services.stopCustomer(payload);
    message.success('客户停止成功');
    this.dispatch({
      type: '$serviceCustomerList',
      payload: {
        current: current > maxPage ? maxPage : current,
      },
    });
    this.updateState({
      selectedRowKeys: [],
      stopVisible: false,
    });
    this.dispatch({
      type: 'custom_layout/updateState',
      payload: {
        isNeedRefresh: true,
      },
    });
  },

  /** 删除客户
   * @param {*array} customerIdList 客户id
   */
  async $deleteCustomer(payload) {
    const { customerIdList } = payload;
    const { selectedRows, total, pageSize, current } = this.getState();
    const maxPage = Math.ceil((total - selectedRows.length) / pageSize) || 1;
    try {
      await services.deleteCustomer(customerIdList);
      message.success('客户删除成功');
      this.dispatch({
        type: '$serviceCustomerList',
        payload: {
          current: current > maxPage ? maxPage : current,
        },
      });
    } catch (err) {
      if (err.status === 300) {
        message.destroy();
        const { createAccount, hasContract, hasInvoice, hasReceipt } = err.data;
        let reason = trim(`${createAccount.length ? '已建账、' : ''}
                              ${hasContract.length ? '已有合同、' : ''}
                              ${hasInvoice.length ? '已有开票、' : ''}
                              ${hasReceipt.length ? '已收费、' : ''}`);
        reason = reason.substring(0, reason.length - 1);

        const errList = uniq([...createAccount, ...hasContract, ...hasInvoice, ...hasReceipt]);
        const firstCustomer = selectedRows.filter((item) => item.customerId === errList[0]);
        const { customerName } = firstCustomer[0];
        ShowConfirm({
          title: `“${customerName}”等${errList.length}个客户因${reason}不能删除`,
          width: 346,
          type: 'warning',
          onOk: () => {
            this.updateState({
              selectedRowKeys: [],
              selectedRows: [],
            });
          },
        });
      }
    }
  },

  /** 新增客户初始化数据-获取客户编码、获取服务类型
   */
  async $addCustomInit() {
    const addCustomerCode = await services.getCustomerCode();
    const serviceTypeList = await services.getServiceType();
    this.updateState({
      addCustomerCode,
      serviceTypeList,
    });
  },

  /** 新增客户-回收客户编码
   * @param {*string} customerCode 客户编码
   */
  async $deleteCode(payload) {
    await services.deleteCode(payload);
    this.updateState({
      customVisible: false,
      scanSubData: {},
    });
  },

  /** 新增客户-普通新增
   * @param {*array} customerIdList 客户id
   * @param {*boolean} flag true=保存并建账 false=保存
   */
  async $addCustomer(payload) {
    const { flag, ...rest } = payload;
    const data = await services.addCustomer(rest);
    message.success('客户新增成功');
    let condition = {};
    if (flag) {
      condition = { accountVisible: flag, currRecord: data };
    }
    this.$serviceCustomerList({
      current: 1,
    });
    this.updateState({
      customVisible: false,
      scanSubData: {},
      ...condition,
    });
  },

  /** 新增客户 - 识别新增 >上传识别
   * @param {*file} file 营业执照
   */

  /** 新增客户-识别新增
   * @param {*array} customerIdList 客户id
   * @param {*boolean} flag true=保存并建账 false=保存
   */
  async $scanAddCustomer(payload) {
    const { flag, ...rest } = payload;
    const data = await services.scanAddCustomer(rest);
    message.success('识别新增客户成功');
    let condition = {};
    if (flag) {
      condition = { accountVisible: flag, currRecord: data };
    }
    this.$serviceCustomerList({
      current: 1,
    });
    this.updateState({
      customVisible: false,
      scanSubData: {},
      ...condition,
    });
  },

  /** 指派客户
   * @param {*array} accountingAssistant 会计助理
   * @param {*string} bookkeepingAccounting 记账会计
   * @param {*array} customerConsultant 客户顾问
   * @param {*array} customerIdList 客户id集
   * @param {*array} drawer 开票员
   * @param {*array} taxReportingAccounting 报税会计
   */
  async $assignCustomer(payload) {
    const data = await services.assignCustomer(payload);
    message.success('指派成功');
    // 刷新列表

    this.updateState({
      selectedRowKeys: [],
      assignVisible: false,
    });
    this.dispatch({
      type: '$serviceCustomerList',
    });
    return data;
  },
  /** 查询客户跟进信息列表
   * @param {*array} customerId 客户id
   * @param {*Number} current 当前页
   * @param {*Number} pageSize 每页查询条数
   */
  async $getFollowList(payload = {}) {
    const {
      followCurrent,
      followPageSize,
      followList,
      currRecord: { customerId },
    } = this.getState();
    const subData = {
      customerId,
      current: followCurrent,
      pageSize: followPageSize,
      ...payload,
    };
    const data = await services.getFollowList(subData);
    this.updateState({
      followList: subData.current === 1 ? data.list : [...followList, data.list],
      followListTotal: data.total,
      editFollowItem: {},
    });
    return data;
  },
  /** 添加客户跟进信息
   * @param {*string} content 内容
   * @param {*string} customerName 客户名称
   * @param {*string} customerid 客户id
   * @param {*array} sendStaffIdList @人员
   */
  async $addFollow(payload) {
    const data = await services.addFollow({
      ...payload,
    });
    message.success('跟进记录添加成功');
    // 刷新列表===是否要回到第一页{current:1}
    this.dispatch({
      type: '$getFollowList',
      payload: {
        current: 1,
      },
    });
    this.updateState({
      isFollowHasMore: true,
      followCurrent: 1,
    });
    return data;
  },

  /** 修改客户跟进信息
   * @param {*string} content 内容
   * @param {*string} customerName 客户名称
   * @param {*string} customerId 客户id
   * @param {*array} sendStaffIdList @人员
   * @param {*string} customerFollowId 跟进id
   */
  async $updateFollow(payload) {
    const data = await services.updateFollow(payload);
    this.dispatch({
      type: '$getFollowList',
      payload: {
        current: 1,
      },
    });
    this.updateState({
      isFollowHasMore: true,
      followCurrent: 1,
    });
    return data;
  },

  /** 删除客户跟进信息
   * @param {*String} customerFollowId 跟进id
   */
  async $delFollow(payload) {
    await services.delFollow(payload);
    this.dispatch({
      type: '$getFollowList',
      payload: {
        current: 1,
      },
    });
    this.updateState({
      followCurrent: 1,
    });
    message.success('跟进记录删除成功');
  },

  /** 第三方导入
   * @param {*string} type 软件类型
   * @param {*string} ids
   */
  async $webBatchImport(payload) {
    const data = await services.webBatchImport(payload);

    this.updateState({
      selectCustomVisible: false,
      importProgressVisible: true,
    });
    return data;
  },

  /** 第三方导入>导入进度(webBatchImport后调用)
   */
  async $getTaskStatus() {
    const { thirdProgressPercent } = this.getState();
    if (thirdProgressPercent < 99) {
      this.updateState({
        thirdProgressPercent: thirdProgressPercent + 1,
        thirdProgressStatus: 0,
        importProgressVisible: true,
      });
    }
    const { status } = await services.getTaskStatus();
    switch (status) {
      case 'error':
        // message('error', res.message);
        // importModalStatus({ processBtnStatus: userId === userid, rate: 99 });
        break;
      case 'doing':
        this.timer = setTimeout(() => {
          this.dispatch({
            type: '$getTaskStatus',
          });
        }, 1000);
        break;
      case 'success':
        this.updateState({
          thirdProgressPercent: 100,
          thirdProgressStatus: 1,
        });
        break;
      case 'complete':
        this.updateState({
          thirdProgressPercent: 100,
          thirdProgressStatus: 2,
        });
        break;
      default:
        break;
    }
  },

  /** 第三方导入>导入结果
   */
  async $deleteBatchImportTask() {
    const data = await services.deleteBatchImportTask();
    this.updateState({
      importProgressVisible: false,
    });
    return data;
  },

  /** 如果成功 出现 进度条， 判断 userid 是否相同， 不同则不展示操作按钮
   */
  async $judgeBatchImportTask() {
    const userid = pubData.get('userInfo_userId'); // 获取userid
    const { userId } = await services.judgeBatchImportTask(
      {},
      {
        status: {
          300: () => {},
        },
      },
    );
    if (userId === userid) {
      this.dispatch({
        type: '$getTaskStatus',
      });
    }
  },

  /**
   * 检验客户是否存在已删除账套
   * @param {*String} customerId 客户id
   */
  async $checkCustomer(payload) {
    const data = await services.checkCustomer(payload);
    if (data) {
      ShowConfirm({
        title: '该用户已经建立过账套，是否恢复账套？',
        okText: '重新建账',
        cancelText: '恢复建账',
        onOk: () => {
          this.updateState({
            accountVisible: true,
            currRecord: payload.record,
          });
        },
        onCancel: () => {
          // 跳转到记账平台
          postMessageRouter({
            type: 'agentAccount/routerLocation',
            payload: {
              url: '/account',
              query: {
                visible: true,
              },
            },
          });
        },
      });
    } else {
      this.updateState({
        accountVisible: true,
        currRecord: payload.record,
      });
    }
  },

  /**
   * 根据客户id或者账套id查询账套信息
   * @param {*String} customerId 客户id
   */
  async $getAccountInfo(payload) {
    const data = await services.getAccountInfo(payload);
    this.updateState({
      currRecord: data,
    });
  },
  /**
   * 新建账套
   * @param {*String} accountName 账套名称
   * @param {*String} bookkeepingAccounting 记账会计
   * @param {*String} createTime 建账时间
   * @param {*String} customerId 客户id
   * @param {*int} accountting 会计科目值
   * @param {*String}  subjectTemplateId 会计科目id
   * @param {*String}  subjectTemplateName 会计科目名称
   * @param {*int} vatType 纳税性质（0:一般纳税人1：小规模纳税人）
   */
  async $createNewAccount(payload) {
    await services.createNewAccount(payload);
    message.success('恭喜你，建账成功');
    // 刷新列表
    this.$serviceCustomerList();
    this.updateState({
      accountVisible: false,
    });
  },

  /**
   * exce建账+数据检查
   */
  async $createExcelAccount(payload) {
    try {
      const { data } = await axios.post(
        `${basePath}jz/cloud/forwardInterface/importExcel.do`,
        payload,
      );
      return data;
    } catch (err) {
      message.error('文件有误');
    }
  },

  /**
   * 第三方建账--线下
   */
  async $offlineImportAccount(payload) {
    try {
      const { data } = await axios.post(
        `${basePath}jz/cloud/forwardInterface/importAccinfo.do`,
        payload,
      );
      return data;
    } catch (err) {
      message.error('导入文件过大，系统转后台执行任务，请稍后重新刷新页面查看');
    }
  },

  /**
   * 第三方导入>线上软件 onlineImportAccount
   * @param {*String} code 账号
   * @param {*String} password 密码
   * @param {*String} accId 账套id
   * @param {*String} creator 记账会计
   * @param {*String} type 软件类型
   * @param {*String} accounting 会计制度
   */
  async $onlineImportAccount(payload) {
    const data = await services.onlineImportAccount(payload);
    return data;
  },

  /**
   * 获取可用账套===导入第三方>线上软件
   * @param {*String} code 账号
   * @param {*String} password 密码
   * @param {*String} type 软件类型
   */
  async $getInfoByAccount(payload) {
    const data = await services.getInfoByAccount(payload);
    return data;
  },

  /**
   * 获取软件
   */
  async $getBatchImportWebType() {
    const data = await services.getBatchImportWebType();
    return data;
  },

  /**
   * 其他方式建账===复制账套
   * @param {*String} accountId 账套id
   * @param {*String} customerId 客户id
   */
  async $copyAccount(payload) {
    await services.copyAccount(payload);
    this.$copyAccountProcess({
      accountId: payload.accountId,
    });
  },

  /**
   * 其他方式建账===账套复制进度
   * @param {*String} accountId 账套id
   */
  $copyAccountProcess(payload) {
    progressModal('正在复制账套', '当前复制进度为', (modal) => {
      const timer = setInterval(async () => {
        const data = await services.copyAccountProcess(payload, {
          status: {
            300: (err) => {
              modal.hide();
              clearInterval(timer);
              message.error(err.message);
            },
          },
        });
        const { status } = data;
        if (status === 'processing') {
          // 等待
        } else if (status === 'success') {
          // 成功
          clearInterval(timer);
          this.updateState({
            accountVisible: false,
          });
          modal.hide();
          this.dispatch({
            type: '$serviceCustomerList',
          });
        } else {
          modal.hide();
          clearInterval(timer);
          message.error('复制失败');
        }
      }, 2000);
    });
  },

  async $getListAccount(payload) {
    const data = await services.getListAccount(payload);
    return data;
  },

  /**
   * 检验客户社会信用码是否存在
   * @param {*String} customerId 客户id
   */
  async $checkSocialCode(payload) {
    const { record } = payload;
    const data = await services.checkSocialCode({
      customerId: record.customerId,
    });
    if (data) {
      postMessageRouter({
        type: 'agentAccount/routerLocation',
        payload: {
          url: '/jumpIcbc',
          query: {
            id: record.customerId,
          },
        },
      });
      trackEvent('客户管理', '开户跳转');
    }
    this.updateState({
      openAccountVisible: !data,
      currRecord: record,
    });
  },
  /**
   * 修改客户社会信用码
   * @param {*String} customerId 客户id
   * @param {*String} unifiedSocialCreditCode 客户统一信用码
   */
  async $updateSocialCode(payload) {
    await services.updateSocialCode(payload);
    message.success('客户统一信用码更新成功');
    postMessageRouter({
      type: 'agentAccount/routerLocation',
      payload: {
        url: '/jumpIcbc',
        query: {
          id: payload.customerId,
        },
      },
    });
    trackEvent('客户管理', '开户跳转');
    this.updateState({
      openAccountVisible: false,
    });
  },
  /**
   * 第三方导入>线下软件
   * @param {*String} accId 账套id
   * @param {*String} creator 记账会计
   * @param {*file} file 文件
   * @param {*String} accounting 会计制度
   */
  // 列表初始化查询：服务类型、部门、记账会计、头部开票员、未停用远
  async $getTreeData() {
    const [
      serviceTypeList,
      deptList,
      bookeepers,
      headDrawerList,
      staffList,
      allEmployeeList,
    ] = await Promise.all([
      this.$getServiceType(),
      this.$getDeptList(),
      this.$getBookkeep(),
      this.$getHeadDrawerList(),
      this.$getStaffList(),
      this.$getAllEmployeeList(),
    ]);

    // const serviceTypeList = await services.getServiceType(); // 查询客户自定义列业务类型信息
    // const deptList = await services.getDeptList(); // 查询部门树
    // const bookeepers = await services.getBookkeep(); // 查询记账会计
    // const headDrawerList = await services.getHeadDrawerList(); // 查询头部开票员
    // const staffList = await services.getStaffList(); // 查询未停用的员工集合
    // const allEmployeeList = await services.getAllEmployeeList(); // 查询所有员工集合

    this.updateState({
      serviceTypeList,
      deptList,
      bookeepers,
      headDrawerList,
      staffList,
      allEmployeeList,
    });
  },

  // 查询服务类型
  async $getServiceType() {
    const serviceTypeList = await services.getServiceType(); // 查询客户自定义列业务类型信息
    // this.updateState({
    //   serviceTypeList,
    // });
    return serviceTypeList || [];
  },

  // 查询部门树
  async $getDeptList() {
    const aList = await services.getDeptList();
    return aList || [];
  },

  // 查询记账会计
  async $getBookkeep() {
    const aList = await services.getBookkeep();
    return aList || [];
  },

  // 查询头部开票员
  async $getHeadDrawerList() {
    const aList = await services.getHeadDrawerList();
    return aList || [];
  },

  // 查询未停用的员工集合
  async $getStaffList() {
    const aList = await services.getStaffList();
    return aList || [];
  },

  // 查询所有员工集合
  async $getAllEmployeeList() {
    const aList = await services.getAllEmployeeList();
    return aList || [];
  },

  /**
   * 获取会计科目 querySubjectTemplateList
   * @param {*int} vatType 纳税性质（0:一般纳税人1：小规模纳税人）
   * @param {*int} type=1
   * @param {*int} ableFlag=1
   */

  // 记账会计等接口查询
  $initQuery() {
    this.$getTreeData();
    this.$getRoletypeList();
  },

  // 更多条件查询list
  async $moreInitQuery() {
    this.$getRoletypeList(); // 派工
    const serviceTypeList = await services.getServiceType(); // 查询客户自定义列业务类型信息
    const deptList = await services.getDeptList(); // 查询部门树
    const bookeepers = await services.getBookkeep(); // 查询记账会计
    this.updateState({
      serviceTypeList,
      deptList,
      bookeepers,
    });
  },

  // 派工条件查询list
  async $assignInitQuery() {
    this.$getRoletypeList(); // 派工
    const bookeepers = await services.getBookkeep(); // 查询记账会计
    this.updateState({
      bookeepers,
    });
  },

  // 建账条件查询list
  async $accountInitQuery() {
    const bookeepers = await services.getBookkeep(); // 查询记账会计
    this.updateState({
      bookeepers,
    });
  },

  // 列表条件查询list
  listInitQuery() {
    this.getQueryParam();
    this.$getHeaderColumn();
    this.$serviceCustomerList();
  },
  // 初始化数据
  initData() {
    this.getQueryParam();
    this.$getHeaderColumn();
    this.$serviceCustomerList();
    // // const timer = setTimeout(() => {
    this.$initQuery();
    // clearTimeout(timer);
    // }, 1000);
  },
};
