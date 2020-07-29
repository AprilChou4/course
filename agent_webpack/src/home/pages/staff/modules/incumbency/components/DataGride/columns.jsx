import React from 'react';
import { Icon } from 'antd';
import classnames from 'classnames';
import pubData from 'data';
import { dictionary } from '@pages/staff/utils';
import { If, LinkButton } from '@components';

export default function({
  rolesList,
  pagination,
  handleEdit,
  handleAdminEditSelf,
  handleStop,
  handleAuth,
  handleDelete,
}) {
  const userAuth = pubData.get('authority');
  const curStaffId = pubData.get('userInfo_staffId');

  return [
    {
      title: '序号',
      key: 'index',
      dataIndex: 'index',
      align: 'center',
      width: 52,
      render: (text, record, index) => index + 1 + (pagination.current - 1) * pagination.pageSize,
    },
    {
      title: '姓名',
      key: 'realName',
      dataIndex: 'realName',
      align: 'center',
      width: 120,
    },
    {
      title: '手机号码',
      key: 'phoneNum',
      dataIndex: 'phoneNum',
      align: 'center',
      width: 110,
    },
    {
      title: '账号',
      key: 'username',
      dataIndex: 'username',
      align: 'center',
      width: 140,
      ellipsis: true,
    },
    {
      title: '部门',
      key: 'deptNames',
      dataIndex: 'deptNames',
      align: 'center',
      minWidth: 190,
    },
    {
      title: '角色',
      key: 'roleIds',
      dataIndex: 'roleNames',
      align: 'center',
      width: 238,
      className: 'table-filter',
      filters: rolesList,
      filterIcon: (filtered) => (
        <Icon
          component={() => (
            <i className={classnames('iconfont', { 'c-primary': filtered })}>&#xe688;</i>
          )}
        />
      ),
      // filteredValue: 'Joe' || null,
    },
    {
      title: '加入时间',
      key: 'createTime',
      dataIndex: 'createTime',
      align: 'center',
      width: 160,
      ellipsis: true,
    },
    {
      title: '状态',
      key: 'status',
      dataIndex: 'status',
      align: 'center',
      width: 80,
      render: (text) => dictionary.staffStatus.map[text] || '-',
    },
    {
      title: '操作',
      key: 'show',
      dataIndex: 'show',
      align: 'center',
      width: 180,
      fixed: 'right',
      className: 'btn-operations',
      render: (text, record) => {
        // 涉及到的相关权限：39:部门员工_修改，40:部门员工_停用，41:部门员工_授权/查看，47:权限中心_显示菜单，48:权限中心_查看，50:权限中心_编辑职员权限
        // 当前用户一定能查看自己的权限，除非权限中心没有配。
        // 当前用户显示"查看"，否则显示"授权"。
        const isCurUser = curStaffId === record.staffId; // 是否是当前用户
        const isShow = !!record.show; // 是后台对角色的权限控制，比如员工不能查看经理
        const isManage = record.type === 1; // 此用户是否是超级管理员（员工级别(1管理员，2经理，3员工)）
        const showEdit = !(isCurUser && !isManage) && isShow && userAuth[39]; // 当前用户如果是超级管理员 可以修改自己，否则禁用。
        const showStop = !isCurUser && isShow && userAuth[40] && ![-1].includes(record.status);
        // "未激活"的不能停用和授权。
        const showAuth =
          (isCurUser ? true : isShow && userAuth[50]) &&
          userAuth[41] &&
          userAuth[47] &&
          userAuth[48] &&
          ![-1].includes(record.status);
        // 只能删除未激活员工和已停用员工
        const showDelete = [-1, 1].includes(record.status) && userAuth[569];
        return (
          <>
            <If condition={showEdit}>
              <LinkButton
                onClick={() =>
                  isCurUser && isManage ? handleAdminEditSelf(record) : handleEdit(record)
                }
              >
                修改
              </LinkButton>
            </If>
            <If condition={showStop}>
              <LinkButton onClick={() => handleStop(record)}>
                {record.status === 0 ? '停用' : '启用'}
              </LinkButton>
            </If>
            <If condition={showAuth}>
              <LinkButton onClick={() => handleAuth(record)}>
                {isCurUser ? '查看' : '授权'}
              </LinkButton>
            </If>
            <If condition={showDelete}>
              <LinkButton onClick={() => handleDelete(record)}>删除</LinkButton>
            </If>
          </>
        );
      },
    },
  ];
}
