// 收款计划明细表
import React, { useEffect, useMemo } from 'react';
import { connect } from 'nuomi';
import moment from 'moment';
import TaxTable from '@components/TaxTable';

import Style from './style.less';

const DetailTable = ({
  tableHeight,
  detailTableList,
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
      render: (text) => <div className="f-ellipsis">{text}</div>,
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
      scroll.x = sumWidth + 50;
    }
    return scroll;
  }, [columns]);
  const totalColumns = [
    {
      title: '合计',
      key: 'index',
      align: 'left',
      width: calcScroll.x - 210 * 3 - 8,
    },
    // 应收金额
    {
      title: totalShouldReceive || 0,
      dataIndex: 'shouldReceiveMoney',
      align: 'right',
      width: 210,
    },
    // 已收金额
    {
      title: totalReceived || 0,
      dataIndex: 'receivedMoney',
      align: 'right',
      width: 210,
    },
    // 未收金额
    {
      title: totalUnReceived || 0,
      dataIndex: 'unReceivedMoney',
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

  // 获取收款计划明细表
  useEffect(() => {
    dispatch({
      type: '$getCollectPlanDetailList',
    });
  }, [dispatch]);

  return (
    <TaxTable
      // loading={tableLoading}
      rowKey="planBillId"
      className={Style['m-shouldReceiveBillTable']}
      columns={columns}
      totalColumns={totalColumns}
      total={detailTableList.length > 0}
      editMode={false}
      bordered
      tableName="charge-collectDetailTable"
      rowSelection={{
        columnWidth: '40px',
        selectedRowKeys,
        onChange: changeSelection,
      }}
      locale={{
        emptyText: '暂无数据',
      }}
      tableBodyHeight={tableHeight - 40 - 40}
      tableBodyMinWidth={calcScroll.x}
      pagination={false}
      dataSource={detailTableList}
    />
  );
};

export default connect(({ detailTableList, totalMoney, selectedRowKeys, loadings }) => ({
  detailTableList,
  totalMoney,
  selectedRowKeys,
  tableLoading: loadings.$getCollectPlanDetailList,
}))(DetailTable);
