/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
import moment from 'moment';
import { message } from 'antd';
// import { router } from 'nuomi';
import { isNil } from 'lodash';
import globalServices from '@home/services';
import { role, storeForUser } from '../utils';
import services from '../services';

const MonthFormat = 'YYYY-MM';

export default {
  getLocalData() {
    let columnSource = storeForUser('ACCOUNT_COLUMNS_SOURCE_1');
    if (columnSource) {
      columnSource = JSON.parse(columnSource);
    }
    if (!columnSource || columnSource.length === 0) {
      // 后面多加了增值税申报类型
      columnSource = [
        {
          key: '编号',
          type: 'index',
        },
        {
          key: '账套名称',
        },
        {
          key: '客户名称',
          selected: false,
        },
        {
          key: '纳税性质',
        },
        {
          key: '增值税申报类型',
          selected: false,
        },
        {
          key: '记账会计',
        },
        {
          key: '会计助理',
        },
        {
          key: '账套进度',
        },
        {
          key: '结账状态',
        },
        {
          key: '审核状态',
        },
        {
          key: '建账期间',
        },
        {
          key: '当前账期',
        },
        {
          key: '风险检测',
        },
      ];
    }

    /**
     * sort: 0, 建账期间排序，默认倒序
     * sortByCode:0  客户编码排序
     */
    let sorters = localStorage.getItem('ACCOUNT_COLUMN_SORT');

    sorters = sorters ? JSON.parse(sorters) : {};
    // columnSource = columnSource.filter((ele) => {
    //   if (['记账会计', '会计助理'].includes(ele.key)) {
    //     if (
    //       role === 0 ||
    //       (role === 1 && ele.key === '会计助理') ||
    //       (role !== 1 && ele.key === '记账会计')
    //     ) {
    //       return true;
    //     }
    //     return false;
    //   }
    //   return true;
    // });

    // 助理会计不显示风险监测
    if (role === 3) {
      columnSource = columnSource.filter((ele) => ele.key !== '风险检测');
    }

    const pageSize = parseInt(storeForUser('account_table_pagesize') || '20');
    this.updateState({
      // 每页显示数量
      pageSize,
      // 排序查询条件
      sorters,
      // 表格列
      columnSource,
    });
  },

  async initData() {
    // 先获取日期，再请求列表和统计
    await this.getDate();
    this.getLocalData();
    this.updateMainDatas(true);
    this.getCompanySetAuditing();
    // this.isShowreCycle();
  },

  // 是否展开回收站
  // isShowreCycle() {
  //   const {
  //     query: { visible },
  //   } = router.location();
  //   this.dispatch({
  //     type: 'accountRecycleBin/updateState',
  //     payload: {
  //       visible: !!visible,
  //     },
  //   });
  // },

  // 查询是否开启审核
  async getCompanySetAuditing() {
    const data = await services.getCompanySetAuditing();
    this.updateState({
      enabledReview: !!data,
    });
  },

  async getSearchOptions() {
    const [creators = [], operators = []] = await Promise.all([
      this.getAccountingList(),
      this.getAccountingAssistantList(),
    ]);

    const creatorMap = {};
    const operatorMap = {};
    creators.forEach((ele) => {
      creatorMap[ele.staffId] = ele.realName;
    });
    operators.forEach((ele) => {
      operatorMap[ele.staffId] = ele.realName;
    });

    this.updateState({
      operators,
      creators,
      operatorMap,
      creatorMap,
    });
  },

  // 更新记账平台主页面相关数据
  updateMainDatas(init) {
    this.query(init);
    this.getAccountStatistics();
  },

  // 获取记账会计
  async getAccountingList() {
    const data = await services.getAccountingList();
    return data || [];
  },

  // 获取会计助理
  async getAccountingAssistantList() {
    const data = await services.getAccountingAssistantList();
    return data || [];
  },

  // 查询日期
  async getDate() {
    const { defaultDate, maxDate, minDate } = await services.getDate();
    this.updateState({
      startDate: defaultDate,
      maxDate: moment(maxDate).format(MonthFormat),
      minDate: moment(minDate).format(MonthFormat),
    });
  },

  // 设置查询数据
  // TODO: 应该放到reducers里
  setQuery(payload = {}) {
    this.updateState({
      query: payload,
    });
  },

  // FIXME: 待优化
  // 获取账套列表
  async query(init) {
    const {
      startDate,
      query,
      pageSize,
      current,
      sorters,
      creatorMap,
      operatorMap,
      columnSource,
    } = this.getState();
    const params = {};
    for (const i in query) {
      const value = query[i];
      if (Array.isArray(value)) {
        params[i] = value.join(',');
      } else if (typeof value === 'boolean') {
        params[i] = value ? 1 : 0;
      } else {
        params[i] = value;
      }
    }

    // 处理排序，后端每次只支持一种排序
    let order;
    if (!isNil(sorters.sortByCode)) {
      order = sorters.sortByCode ? 'customerCodeAsc' : 'customerCodeDesc';
    } else if (!isNil(sorters.sort)) {
      order = sorters.sort ? 'periodAsc' : 'periodDesc';
    }

    const param = {
      searchDate: startDate,
      current: init ? 1 : current,
      pageSize,
      order,
      ...params,
    };

    // 没有建账期间列，删除排序
    if (columnSource.find((ele) => ele.key === '建账期间' && ele.selected === false)) {
      delete param.sort;
    }

    // FIXME: 临时处理传参
    // 账套名称
    param.accountName = param.name;
    delete param.name;
    // 账套进度
    param.scheduleList = param.schedules
      ? param.schedules.split(',').map((val) => Number(val))
      : undefined;
    delete param.schedules;
    // 报税类型（纳税性质）
    param.vatTypeList = param.taxType
      ? param.taxType.split(',').map((val) => Number(val))
      : undefined;
    delete param.taxType;
    // 记账会计
    param.bookkeepingAccounting = param.creator ? param.creator.split(',') : undefined;
    delete param.creator;
    // 会计助理
    param.accountingAssistant = param.operator ? param.operator.split(',') : undefined;
    delete param.operator;
    // 审核状态
    param.reviewStatusList = param.reviewStatus
      ? param.reviewStatus.split(',').map((val) => Number(val))
      : undefined;
    delete param.reviewStatus;
    // 结账状态
    param.checkOutList = param.isCheckOut
      ? param.isCheckOut.split(',').map((val) => Number(val))
      : undefined;
    delete param.isCheckOut;
    // 业务形态
    param.businessPatternList = param.businessPattern
      ? param.businessPattern.split(',').map((val) => Number(val))
      : undefined;
    delete param.businessPattern;

    try {
      const { pageNum, total, list } = await services.getAccountList(param, {
        loading: '正在获取账套列表...',
      });
      this.updateState({
        selectedRowKeys: [],
        dataSource: list.map((ele, i) => {
          const data = {};
          if (ele.createPeriod) {
            data.createPeriod = ele.createPeriod.replace(/-(\d{1})$/, '-0$1');
          }
          if (ele.currentPeriod) {
            data.currentPeriod = ele.currentPeriod.replace(/-(\d{1})$/, '-0$1');
          }
          if (ele.creator) {
            data.creator = ele.creator
              .split(',')
              .map((el) => creatorMap[el] || '')
              .join(',');
          }
          // if (ele.operator) {
          //     ele.operator = ele.operator.split(',').map(ele => operatorMap[ele] || '').join(',');
          // }
          return {
            ...ele,
            key: ele.accountId,
            index: i + 1 + (pageNum - 1) * pageSize,
            ...data,
          };
        }),
        current: pageNum,
        total,
      });
    } catch (error) {
      console.error(error);
      message.error('获取账套列表失败！');
    }
  },

  // 获取统计数据
  async getAccountStatistics() {
    const { startDate, totalData } = this.getState();
    const data = await services.getAccountStatistics(
      {
        currentDate: startDate,
      },
      { errMsg: '获取账套统计数据失败！' },
    );
    this.updateState({
      totalData: {
        ...totalData,
        ...data,
      },
    });
  },

  // 删除账套
  async deleteAccount(payload = {}) {
    await services.deleteAccount(payload);
    this.updateMainDatas();
    message.success('删除成功');
  },

  // 编辑账套弹层
  updateEditAccount(payload = {}) {
    const { editAccount } = this.getState();
    this.updateState({
      editAccount: {
        ...editAccount,
        ...payload,
      },
    });
  },

  // 编辑账套
  async editAccount(payload) {
    await services.editAccount(payload, { loading: '正在保存中...' });
    message.success('保存成功');
    this.updateEditAccount({ visible: false });
    this.updateMainDatas();
  },

  // 查询账套信息
  async getAccountInfo(payload) {
    const data = await services.getAccountInfo(payload, { errMsg: '查询账套信息失败' });
    return data;
  },

  // 查询会计科目列表
  async getSubjectTemplateList(payload) {
    const data = await services.getSubjectTemplateList(payload, {
      errMsg: '查询会计科目列表失败！',
    });
    return data;
  },

  // 账套结账前提示信息
  async beforeCheck(payload) {
    const data = await services.beforeCheck(payload, {
      status: {
        300: (res) => {
          message.warning(res.message);
        },
      },
    });
    return data;
  },

  // 账套结账
  async checkOut(payload) {
    const data = await services.checkOut(payload);
    return data || true;
  },

  // 账套结账进度
  async checkOutProcess(payload) {
    const data = await services.checkOutProcess(payload);
    return data;
  },

  // 账套审核前提示信息
  async beforeReview(payload) {
    const data = await services.beforeReview(payload);
    return data;
  },

  // 账套审核
  async review(payload) {
    const data = await services.review(payload);
    return data || true;
  },

  // 账套审核进度
  async reviewProcess(payload) {
    const data = await services.reviewProcess(payload, {
      returnAll: true,
    });
    return data;
  },

  // 查询所有员工集合
  async getAllEmployeeList(payload) {
    const data = await globalServices.getAllEmployeeList(payload);
    return data;
  },
};
