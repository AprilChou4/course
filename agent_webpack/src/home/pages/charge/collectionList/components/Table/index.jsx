import React, { useMemo } from 'react';
import { connect } from 'nuomi';
import moment from 'moment';
import { postMessageRouter } from '@utils';
import TaxTable from '@components/TaxTable';

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
  const { receiveMoneyTotal, preReceiptMoneyTotal, freeMoneyTotal, userPreReceiptMoneyTotal } =
    totalMoney || {};

  // 跳转收款单列表
  const toDetail = (id) => {
    postMessageRouter({
      type: 'agentAccount/routerLocation',
      payload: {
        url: '/charge/viewCollection',
        query: {
          id,
        },
      },
    });
  };
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
      render: (text) => (
        // format('YYYY-MM-DD HH:mm:ss')
        <span>{moment(text, 'X').format('YYYY-MM-DD')}</span>
      ),
    },
    {
      title: '单据编号',
      dataIndex: 'receiptNo',
      align: 'center',
      width: 140,
      render: (text, { receiveBillId }) => (
        <a className={Style['m-receiptNo']} onClick={() => toDetail(receiveBillId)}>
          {text || '-'}
        </a>
      ),
    },

    {
      title: '客户名称',
      dataIndex: 'customerName',
      align: 'center',
      width: 220,
      render: (text) => (
        <div className="f-tal f-ellipsis" title={text}>
          {text}
        </div>
      ),
    },
    {
      title: '收款时间',
      dataIndex: 'receiptDate',
      align: 'center',
      width: 105,
      render: (text) => <span>{moment(text, 'X').format('YYYY-MM-DD')}</span>,
    },
    {
      title: '收款人',
      dataIndex: 'receiptStaffName',
      align: 'center',
      width: 90,
      render: (text) => text || '-',
    },
    {
      title: '源单类型',
      dataIndex: 'sourceBillType',
      align: 'center',
      width: 90,
      render: (text) => {
        // 源单类型 0-单独创建  1-应收单
        return [0, 1].includes(text) ? ['单独创建', '应收单'][text] : '-';
      },
    },
    {
      title: '源单据号',
      dataIndex: 'sourceBillNo',
      align: 'center',
      width: 145,
      render: (text) => text || '-',
    },
    {
      title: '实收金额',
      dataIndex: 'totalReceiptMoney',
      align: 'center',
      width: 115,
      render: (text) => <div className="f-tar">{text}</div>,
    },
    {
      title: '本次预收',
      dataIndex: 'preReceiptMoney',
      align: 'center',
      width: 115,
      render: (text) => <div className="f-tar">{text}</div>,
    },
    {
      title: '优惠金额',
      dataIndex: 'freeMoney',
      align: 'center',
      width: 115,
      render: (text) => <div className="f-tar">{text}</div>,
    },
    {
      title: '使用预收',
      dataIndex: 'userPreReceiptMoney',
      align: 'center',
      width: 115,
      render: (text) => <div className="f-tar">{text}</div>,
    },
  ];

  // 计算table的scroll。为了保证table的scroll.x大于非固定列的宽度，否则会出现 列头与内容不对齐或出现列重复
  const calcScroll = useMemo(() => {
    const scroll = {};
    if (columns && columns.length !== 0) {
      const colWidthArr = columns.map((v) => v.width || 0);
      const sumWidth = colWidthArr.reduce((preValue, curValue) => preValue + curValue);
      scroll.x = sumWidth + 40 + 8;
    }
    return scroll;
  }, [columns]);
  console.log(calcScroll.x, '--------------dadasda');
  const totalColumns = [
    {
      title: '合计',
      key: 'index',
      align: 'left',
      width: calcScroll.x - 115 * 4 - 8,
    },
    // 实收金额
    {
      title: receiveMoneyTotal || 0,
      dataIndex: 'totalReceiptMoney',
      align: 'right',
      width: 115,
    },
    // 本次预收
    {
      title: preReceiptMoneyTotal || 0,
      dataIndex: 'preReceiptMoney',
      align: 'right',
      width: 115,
    },
    // 优惠金额合计
    {
      title: totalMoney.freeMoneyTotal || 0,
      dataIndex: 'freeMoney',
      align: 'right',
      width: 115,
    },
    // 使用预收合计
    {
      title: userPreReceiptMoneyTotal || 0,
      dataIndex: 'userPreReceiptMoney',
      align: 'right',
      width: 115,
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
      rowKey="receiveBillId"
      className={Style['m-receiveBillTable']}
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
      tableName="charge-collectTable"
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
    tableLoading: loadings.$getReceiveBillList,
  }),
)(AccountTable);
