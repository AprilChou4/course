import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Table } from 'antd';
import { connect } from 'nuomi';
import { AntdTable, LinkButton, ShowConfirm } from '@components';

const ToReceive = ({ toReceive: { pagination, ...restTableOptions }, loadings, dispatch }) => {
  const handleReceive = useCallback(
    (record) => () => {
      dispatch({
        type: 'updateAssignAccounting',
        payload: {
          record,
          visible: true,
        },
      });
    },
    [dispatch],
  );
  const handleRefuse = useCallback(
    ({ recordId }) => () => {
      ShowConfirm({
        title: '您确认要拒绝接收该账套吗？',
        content: '拒绝后该账套将退回给移交人',
        onOk() {
          dispatch({
            type: 'refuse',
            payload: {
              recordId,
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
        title: '移交时间',
        dataIndex: 'operateTime',
        align: 'center',
        width: 150,
      },
      {
        title: '操作',
        dataIndex: 'options',
        align: 'center',
        width: 100,
        render(text, record) {
          return (
            <div className="btn-operations">
              <LinkButton onClick={handleReceive(record)}>接收</LinkButton>
              <LinkButton onClick={handleRefuse(record)}>拒绝</LinkButton>
            </div>
          );
        },
      },
    ],
    [handleReceive, handleRefuse, pagination],
  );
  const onPaginationChange = useCallback(
    (page, pageSize) => {
      dispatch({
        type: '$getToReceiveList',
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
      type: '$getToReceiveList',
    });
  }, [dispatch]);

  return (
    <AntdTable
      {...restTableOptions}
      columns={columns}
      loading={loadings.$getToReceiveList}
      pagination={tablePagination}
    />
  );
};

export default connect(({ toReceive, loadings }) => ({
  toReceive,
  loadings,
}))(ToReceive);
