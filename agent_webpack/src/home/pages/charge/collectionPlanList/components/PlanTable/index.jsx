// 收款计划表
import React, { useMemo, useEffect } from 'react';
import { connect } from 'nuomi';
import moment from 'moment';
import TaxTable from '@components/TaxTable';

import Style from './style.less';

const AccountTable = ({
  tableHeight,
  planTableList,
  totalMoney,
  selectedRowKeys,
  tableLoading,
  dispatch,
}) => {
  const { totalShouldReceive, totalReceived, totalUnReceived } = totalMoney;
  const columns = [
    {
      title: '序号',
      key: 'index',
      render: (text, record, index) => <span>{index + 1}</span>,
      align: 'center',
      width: 70,
    },
    {
      title: '应收日期',
      dataIndex: 'shouldReceiveDate',
      align: 'center',
      width: 130,
      render: (text) => <span>{moment(text, 'X').format('YYYY-MM-DD')}</span>,
    },
    {
      title: '摘要',
      dataIndex: 'remark',
      align: 'center',
      width: 270,
      render: (text) => (
        <div className="f-ellipsis" title={text}>
          {text}
        </div>
      ),
    },
    {
      title: '应收金额',
      dataIndex: 'shouldReceiveMoney',
      align: 'center',
      width: 210,
      render: (text) => <div className="f-tar">{text}</div>,
    },
    {
      title: '已收金额',
      dataIndex: 'receivedMoney',
      align: 'center',
      width: 210,
      render: (text) => <div className="f-tar">{text}</div>,
    },
    {
      title: '未收金额',
      dataIndex: 'unReceivedMoney',
      align: 'center',
      width: 210,
      render: (text) => <div className="f-tar">{text}</div>,
    },
  ];

  // 计算table的scroll。为了保证table的scroll.x大于非固定列的宽度，否则会出现 列头与内容不对齐或出现列重复
  const calcScroll = useMemo(() => {
    const scroll = {};
    if (columns && columns.length !== 0) {
      const colWidthArr = columns.map((v) => v.width || 0);
      const sumWidth = colWidthArr.reduce((preValue, curValue) => preValue + curValue);
      scroll.x = sumWidth + 40;
    }
    return scroll;
  }, [columns]);

  const totalColumns = [
    {
      title: '合计',
      key: 'index',
      align: 'left',
      width: calcScroll.x - 210 * 3,
    },
    {
      title: totalShouldReceive || 0,
      dataIndex: 'totalReceiptMoney',
      align: 'right',
      width: 210,
    },
    {
      title: totalReceived || 0,
      dataIndex: 'totalReceived',
      align: 'right',
      width: 210,
    },
    {
      title: totalUnReceived || 0,
      dataIndex: 'totalUnReceived	',
      align: 'right',
      width: 210,
    },
  ];

  // 改变复选框
  const changeSelection = (selectedRowKeys, selectedRows) => {
    dispatch({
      type: 'updateState',
      payload: {
        selectedRowKeys,
        selectedRows,
      },
    });
  };

  return (
    <TaxTable
      // loading={tableLoading}
      rowKey={(record, index) => index}
      className={Style['m-shouldReceiveBillTable']}
      columns={columns}
      totalColumns={totalColumns}
      total={planTableList.length > 0}
      editMode={false}
      bordered
      tableName="charge-collectPlanTable"
      rowSelection={{
        columnWidth: '40px',
        selectedRowKeys,
        onChange: changeSelection,
      }}
      locale={{
        emptyText: '暂无数据',
      }}
      tableBodyHeight={tableHeight - 40 - 40}
      pagination={false}
      tableBodyMinWidth={calcScroll.x}
      dataSource={planTableList}
    />
  );
};

export default connect(({ planTableList, totalMoney, selectedRowKeys, loadings }) => ({
  planTableList,
  totalMoney,
  selectedRowKeys,
  tableLoading: loadings.$getCollectPlanList,
}))(AccountTable);
