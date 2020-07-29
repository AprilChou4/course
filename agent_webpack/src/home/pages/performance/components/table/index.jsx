import React from 'react';
import { connect } from 'nuomi';
import { Button } from 'antd';
import postMessageRouter from '@utils/postMessage';
import { AntdTable } from '@components';

import './style.less';

const AccountTable = ({ tableList, total, current, period, pageSize, tableLoading, dispatch }) => {
  // 跳转到客户列表，带上搜索条件
  function toCustomerList(vatType, staffId) {
    window.clientParams = {
      bookkeepingAccounting: [staffId],
      vatType,
    };
    postMessageRouter({
      type: 'agentAccount/routerLocation',
      payload: {
        url: '/custom/list',
      },
    });
  }

  // 跳转收费管理，带上收搜索条件
  function toCharge(staffId) {
    sessionStorage.setItem(
      'chargeSess',
      JSON.stringify({
        bookerId: staffId,
        payTime: period.replace('-', ''),
      }),
    );
    postMessageRouter({
      type: 'agentAccount/routerLocation',
      payload: {
        url: '/charge',
      },
    });
  }

  const columns = [
    {
      title: '编号',
      key: 'index',
      render: (text, record, index) => <span style={{ color: '#000' }}>{index + 1}</span>,
      align: 'center',
      width: 68,
    },
    {
      title: '会计',
      dataIndex: 'realName',
      align: 'center',
      width: 235,
      render: (text) => <span style={{ color: '#000' }}>{text}</span>,
    },
    {
      title: '客户',
      children: [
        {
          title: '一般纳税人',
          dataIndex: 'nomalCount',
          align: 'center',
          render: (text, record) => (
            <Button type="link" onClick={() => toCustomerList(0, record.staffId)}>
              {text}
            </Button>
          ),
        },
        {
          title: '小规模纳税人',
          dataIndex: 'smallCount',
          align: 'center',
          render: (text, record) => (
            <Button type="link" onClick={() => toCustomerList(1, record.staffId)}>
              {text}
            </Button>
          ),
        },
        {
          title: '总数',
          dataIndex: 'total',
          align: 'center',
          render: (text, record) => (
            <Button type="link" onClick={() => toCustomerList(-1, record.staffId)}>
              {text}
            </Button>
          ),
        },
      ],
    },
    {
      title: '工作量',
      children: [
        {
          title: '凭证数',
          dataIndex: 'voucherCount',
          align: 'center',
          render: (text) => <span>{text || 0}</span>,
        },
        {
          title: '分录数',
          dataIndex: 'voucherlineCount',
          align: 'center',
          render: (text) => <span>{text || 0}</span>,
        },
      ],
    },
    {
      title: '累计收款',
      dataIndex: 'sumMoney',
      align: 'center',
      render: (text, record) =>
        text != null ? (
          <Button type="link" onClick={() => toCharge(record.staffId)}>
            {text.toFixed(2)}
          </Button>
        ) : null,
    },
  ];

  // 页码改变
  const handlePageChange = (page) => {
    dispatch({
      type: 'updateCondition',
      payload: {
        current: page,
      },
    });
  };

  // pageSize 变化
  const handlePageSizeChange = (page, size) => {
    dispatch({
      type: 'updateCondition',
      payload: {
        pageSize: size,
      },
    });
  };

  return (
    <div styleName="staff-performance-table">
      <AntdTable
        loading={tableLoading}
        rowKey="staffId"
        columns={columns}
        bordered
        pagination={{
          showSizeChanger: true,
          current,
          total,
          pageSize,
          showTotal: (count) => `共${count}条`,
          onChange: handlePageChange,
          onShowSizeChange: handlePageSizeChange,
        }}
        dataSource={tableList}
        scroll={{ y: true }}
      />
    </div>
  );
};

export default connect(({ tableList, total, tableConditions, loadings }) => ({
  tableList,
  total,
  current: tableConditions.current,
  pageSize: tableConditions.pageSize,
  period: tableConditions.period,
  tableLoading: loadings.$getList,
}))(AccountTable);
