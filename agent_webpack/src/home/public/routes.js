import React from 'react';
import { Route } from 'nuomi';

const routes = [
  // 系统消息
  {
    path: '/message/systemsg',
    async: () => import('../pages/message/systemsg'),
  },
  // 定时消息
  {
    path: '/message/timing/:type',
    async: () => import('../pages/message/timing'),
  },
  // 发送消息
  {
    path: '/message/send',
    async: () => import('../pages/message/send'),
  },
  // 即时消息
  {
    path: '/message/instant',
    async: () => import('../pages/message/instant'),
  },
  // 消息记录
  {
    path: '/message/record',
    async: () => import('../pages/message/record'),
  },
  // 消息设置
  {
    path: '/message/setting',
    async: () => import('../pages/message/setting'),
  },
  // 客户管理>列表
  {
    path: '/custom/list',
    async: () => import('../pages/custom/list/layout'),
  },
  // 客户管理>详情
  {
    path: '/custom/detail',
    async: () => import('../pages/custom/detail/layout'),
  },
  // 记账平台
  {
    path: '/account',
    async: () => import('../pages/account'),
  },
  // 收费管理
  // 应收单
  {
    path: '/charge/receivable',
    async: () => import('../pages/charge/receivable'),
  },
  // 查看应收单
  {
    path: '/charge/viewReceivable',
    async: () => import('../pages/charge/viewReceivable'),
  },
  // 应收单列表
  {
    path: '/charge/receivableList',
    async: () => import('../pages/charge/receivableList'),
  },
  // 收款计划汇
  {
    path: '/charge/collectionPlanList',
    async: () => import('../pages/charge/collectionPlanList'),
  },
  // 收款单
  {
    path: '/charge/collection',
    async: () => import('../pages/charge/collection'),
  },
  // 查看收款单
  {
    path: '/charge/viewCollection',
    async: () => import('../pages/charge/viewCollection'),
  },
  // 收款单列表
  {
    path: '/charge/collectionList',
    async: () => import('../pages/charge/collectionList'),
  },
  // 部门与员工
  {
    path: '/staff',
    async: () => import('../pages/staff'),
  },
  // 员工业绩
  {
    path: '/performance',
    async: () => import('../pages/performance'),
  },
  // 组件示例
  {
    path: '/demo',
    async: () => import('../pages/demo'),
  },
  // 发票代开
  {
    path: '/fpdk/:type',
    async: () => import('../pages/fpdk'),
  },
  // 提供报税设置页面给财税助手嵌入 http://192.168.200.55:90/issues/129516
  {
    path: '/cszs/tax/setting',
    async: () => import('../pages/custom/detail/taxInfo'),
  },
];

export default routes.map((route) => <Route wrapper key={route.path} {...route} />);
