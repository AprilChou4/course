import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Table } from 'antd';
import { connect } from 'nuomi';
import { AntdTable, LinkButton, ShowConfirm } from '@components';
import Recovery from './Recovery';

const DataGrid = ({
  table: { pagination, selectedRowKeys, ...restTableOptions },
  loadings,
  dispatch,
}) => {
  const handleDelete = useCallback(
    ({ accountId, accountName = '' }) => () => {
      ShowConfirm({
        title: `确定删除账套“${accountName}”吗？`,
        content: '删除后不可恢复',
        onOk() {
          dispatch({
            type: 'delete',
            payload: {
              list: [accountId],
            },
          });
        },
      });
    },
    [dispatch],
  );

  const columns = useMemo(
    () => [
      {
        title: '账套名称',
        dataIndex: 'accountName',
      },
      {
        title: '建账日期',
        dataIndex: 'ayear',
        align: 'center',
        width: 150,
        render: (text, { aYear, aMonth }) => `${aYear}年${aMonth}月`,
      },
      {
        title: '记账状态',
        dataIndex: 'accountStatus',
        align: 'center',
        width: 130,
      },
      {
        title: '删除人',
        dataIndex: 'deleteUser',
        align: 'center',
        width: 130,
      },
      {
        title: '操作',
        dataIndex: 'options',
        align: 'center',
        width: 110,
        render(text, record) {
          return (
            <div className="btn-operations">
              <Recovery data={{ record }} />
              <LinkButton onClick={handleDelete(record)}>删除</LinkButton>
            </div>
          );
        },
      },
    ],
    [handleDelete],
  );

  const onPaginationChange = useCallback(
    (page, pageSize) => {
      dispatch({
        type: '$getRecycleBinList',
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
      type: '$getRecycleBinList',
    });
  }, [dispatch]);

  const rowSelection = useMemo(
    () => ({
      selectedRowKeys,
      onChange(sRowKeys) {
        dispatch({
          type: 'updateTable',
          payload: {
            selectedRowKeys: sRowKeys,
          },
        });
      },
    }),
    [dispatch, selectedRowKeys],
  );

  return (
    <AntdTable
      {...restTableOptions}
      columns={columns}
      loading={loadings.$getRecycleBinList}
      pagination={tablePagination}
      rowSelection={rowSelection}
    />
  );
};

export default connect(({ table, loadings }) => ({
  table,
  loadings,
}))(DataGrid);
