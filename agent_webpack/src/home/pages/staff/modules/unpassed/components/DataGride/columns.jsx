import React from 'react';
import { dictionary } from '@pages/staff/utils';

export default function({ pagination }) {
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
      width: 100,
    },
    {
      title: '手机号码',
      dataIndex: 'phoneNum',
      align: 'center',
      width: 130,
    },
    {
      title: '申请时间',
      dataIndex: 'createTime',
      align: 'center',
    },
    {
      title: '失败原因',
      dataIndex: 'status',
      align: 'center',
      render: (text) => dictionary.approveFailureReasonType.map[text] || '-',
    },
    {
      title: '操作人',
      dataIndex: 'creator',
      align: 'center',
      width: 130,
    },
    {
      title: '审批时间',
      dataIndex: 'editTime',
      align: 'center',
    },
  ];
}
