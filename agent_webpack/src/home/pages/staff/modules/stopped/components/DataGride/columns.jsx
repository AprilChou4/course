import React from 'react';
import { Icon } from 'antd';
import classnames from 'classnames';
import pubData from 'data';
import { If, LinkButton } from '@components';

export default function({ rolesList, pagination, handleEnable, handleDelete }) {
  const userAuth = pubData.get('authority');

  return [
    {
      title: '序号',
      dataIndex: 'index',
      align: 'center',
      width: 52,
      render: (text, record, index) => index + 1 + (pagination.current - 1) * pagination.pageSize,
    },
    {
      title: '姓名',
      dataIndex: 'realName',
      align: 'center',
      width: 100,
    },
    {
      title: '手机号码',
      dataIndex: 'phoneNum',
      align: 'center',
      width: 130,
    },
    {
      title: '账号',
      dataIndex: 'username',
      align: 'center',
    },
    {
      title: '部门',
      dataIndex: 'deptNames',
      align: 'center',
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
      dataIndex: 'createTime',
      align: 'center',
    },
    {
      title: '停用时间',
      dataIndex: 'stopTime',
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: 'options',
      align: 'center',
      width: 120,
      fixed: 'right',
      className: 'btn-operations',
      render: (text, record) => {
        // 只能删除未激活员工和已停用员工
        return (
          <>
            <If condition={userAuth[40]}>
              <LinkButton onClick={() => handleEnable(record)}>启用</LinkButton>
            </If>
            <If condition={[-1, 1].includes(record.status) && userAuth[569]}>
              <LinkButton onClick={() => handleDelete(record)}>删除</LinkButton>
            </If>
          </>
        );
      },
    },
  ];
}
