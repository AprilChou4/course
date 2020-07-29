import React, { useCallback, useMemo } from 'react';
import { connect } from 'nuomi';
import moment from 'moment';
import { postMessageRouter } from '@utils';
import TaxTable from '@components/TaxTable';
import Operate from './Operate';

import Style from './style.less';

const AccountTable = ({
  tableHeight,
  tableList,
  total,
  totalMoney,
  selectedRowKeys,
  pageSizeOptions,
  current,
  pageSize,
  tableLoading,
  dispatch,
}) => {
  const handleShowReceivable = useCallback(({ shouldReceiveId }) => {
    shouldReceiveId &&
      postMessageRouter({
        type: 'agentAccount/routerLocation',
        payload: {
          url: '/charge/viewReceivable',
          query: {
            id: shouldReceiveId,
          },
        },
      });
  }, []);

  const columns = [
    {
      title: '序号',
      key: 'index',
      render: (text, record, index) => <span>{index + 1}</span>,
      align: 'center',
      width: 50,
    },
    {
      title: '制单日期',
      dataIndex: 'createBillDate',
      align: 'center',
      width: 95,
      render: (text) => <span>{moment(text, 'X').format('YYYY-MM-DD')}</span>,
    },
    {
      title: '单据编号',
      dataIndex: 'srbNo',
      align: 'center',
      width: 140,
      render: (text, record) => (
        <a className={Style['m-srbNo']} onClick={() => handleShowReceivable(record)}>
          {text}
        </a>
      ),
    },
    {
      title: '制单人',
      dataIndex: 'createBillStaffName',
      align: 'center',
      width: 120,
      render: (text) => text || '-',
    },
    {
      title: '客户名称',
      dataIndex: 'customerName',
      align: 'center',
      width: 220,
      render: (text) => (
        <div className="f-tal f-ellipsis" title={text}>
          {text || '-'}
        </div>
      ),
    },
    {
      title: '源单类型',
      dataIndex: 'sourceBillType',
      align: 'center',
      width: 90,
      render: (text) => {
        // 源单类型  0-手动创建 1-合同
        return [0, 1].includes(text) ? ['-', '合同'][text] : '-';
      },
    },
    {
      title: '源单据号',
      dataIndex: 'sourceBillNo',
      align: 'center',
      width: 124,
      render: (text) => text || '-',
    },
    {
      title: '应收金额',
      dataIndex: 'shouldReceiveMoney',
      align: 'center',
      width: 140,
      render: (text) => <div className="f-tar">{text}</div>,
    },
    {
      title: '收款状态',
      dataIndex: 'receiveStatus',
      align: 'center',
      width: 90,
      render: (text) => {
        // 收款状态 0-未收款 1-已收款 2-收款中
        return [0, 1, 2].includes(text) ? ['未收款', '已收款', '收款中'][text] : '-';
      },
    },
    // {
    //   title: '收款计划',
    //   dataIndex: 'receiveId',
    //   align: 'center',
    //   width: 120,
    //   render: (text, record) => <Operate record={record} />,
    // },
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
      width: calcScroll.x - 140 - 90 - 8,
    },
    // 应收金额
    {
      title: totalMoney.receiveMoneyTotal || 0,
      dataIndex: 'totalReceiptMoney',
      align: 'right',
      width: 140,
    },
    {
      title: '',
      dataIndex: 'preReceiptMoney',
      align: 'center',
      width: 90,
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
      rowKey="shouldReceiveId"
      className={Style['m-shouldReceiveBillTable']}
      columns={columns}
      totalColumns={totalColumns}
      total={tableList.length > 0}
      bordered
      rowSelection={{
        columnWidth: '40px',
        selectedRowKeys,
        onChange: changeSelection,
      }}
      locale={{
        emptyText: '暂无数据',
      }}
      // 减去头/合计/分页/滚动条
      tableBodyHeight={tableHeight - 40 - 40 - 48 - 8}
      tableName="charge-receiveTable"
      pagination={{
        showSizeChanger: true,
        pageSizeOptions,
        current,
        total,
        pageSize,
        showTotal: (count) => `共${count}条`,
        onChange: handlePageChange,
        onShowSizeChange: handlePageSizeChange,
      }}
      tableBodyMinWidth={calcScroll.x}
      dataSource={tableList}
    />
  );
};

export default connect(
  ({
    tableList,
    total,
    totalMoney,
    selectedRowKeys,
    pageSizeOptions,
    tableConditions,
    loadings,
  }) => ({
    tableList,
    total,
    totalMoney,
    selectedRowKeys,
    pageSizeOptions,
    current: tableConditions.current,
    pageSize: tableConditions.pageSize,
    tableLoading: loadings.$getShouldReceiveBillList,
  }),
)(AccountTable);
