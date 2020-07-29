import React from 'react';
import pubData from 'data';
import { If, LinkButton } from '@components';

export default function({ pagination, handleApprove, handleReject }) {
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
      title: '申请人',
      dataIndex: 'realName',
      align: 'center',
    },
    {
      title: '手机号码',
      dataIndex: 'phoneNum',
      align: 'center',
    },
    {
      title: '加入时间',
      dataIndex: 'editTime',
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: 'options',
      align: 'center',
      width: 180,
      fixed: 'right',
      className: 'btn-operations',
      render: (text, record) => (
        <If condition={userAuth[43]}>
          <LinkButton onClick={() => handleApprove(record)}>同意</LinkButton>
          <LinkButton onClick={() => handleReject(record)}>拒绝</LinkButton>
        </If>
      ),
    },
  ];
}
