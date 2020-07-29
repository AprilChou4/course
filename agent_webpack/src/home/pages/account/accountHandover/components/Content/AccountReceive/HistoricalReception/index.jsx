import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Table } from 'antd';
import { connect } from 'nuomi';
import { AntdTable } from '@components';

const HistoricalReception = ({
  historicalReception: { pagination, ...restTableOptions },
  loadings,
  dispatch,
}) => {
  const columns = useMemo(
    () => [
      {
        title: '序号',
        dataIndex: 'index',
        align: 'center',
        width: 50,
        render: (text, record, index) => index + 1 + (pagination.current - 1) * pagination.pageSize,
      },
      {
        title: '账套名称',
        dataIndex: 'accountNames',
      },
      {
        title: '移交人',
        dataIndex: 'transferRealName',
        width: 130,
      },
      {
        title: '接收人',
        dataIndex: 'receiptRealName',
        width: 130,
      },
      {
        title: '移交状态',
        dataIndex: 'status',
        align: 'center',
        width: 100,
        render(value) {
          const datas = {
            2: <span className="t-success">接收成功</span>,
            3: (
              <span className="t-error">
                接收失败
                <br />
                接收人拒收
              </span>
            ),
            4: (
              <span className="t-error">
                接收失败
                <br />
                移交人撤回
              </span>
            ),
          };
          return datas[value] || '';
        },
      },
      {
        title: '状态更新时间',
        dataIndex: 'operateTime',
        align: 'center',
        width: 150,
      },
    ],
    [pagination],
  );
  const onPaginationChange = useCallback(
    (page, pageSize) => {
      dispatch({
        type: '$getHistoricalReceptionList',
        payload: {
          pageSize,
          current: page,
        },
      });
    },
    [dispatch],
  );
  const tablePagination = useMemo(() => {
    return {
      ...pagination,
      onChange: onPaginationChange,
      onShowSizeChange: onPaginationChange,
    };
  }, [onPaginationChange, pagination]);

  useEffect(() => {
    dispatch({
      type: '$getHistoricalReceptionList',
    });
  }, [dispatch]);

  return (
    <AntdTable
      {...restTableOptions}
      columns={columns}
      loading={loadings.$getHistoricalReceptionList}
      pagination={tablePagination}
    />
  );
};

export default connect(({ historicalReception, loadings }) => ({
  historicalReception,
  loadings,
}))(HistoricalReception);
