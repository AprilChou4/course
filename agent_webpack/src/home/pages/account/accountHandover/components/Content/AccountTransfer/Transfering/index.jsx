import React, { useEffect, useCallback, useMemo } from 'react';
import { connect } from 'nuomi';
import { AntdTable, LinkButton, ShowConfirm } from '@components';

const Transfering = ({ transfering: { pagination, ...restTableOptions }, loadings, dispatch }) => {
  const handleRefuse = useCallback(
    ({ recordId }) => () => {
      ShowConfirm({
        title: '您确认要撤回该账套吗？',
        content: '撤回后该账套交接失败',
        onOk() {
          dispatch({
            type: 'withdraw',
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
        width: 60,
        render(text, record) {
          return (
            <span className="btn-operations">
              <LinkButton onClick={handleRefuse(record)}>撤回</LinkButton>
            </span>
          );
        },
      },
    ],
    [handleRefuse, pagination],
  );
  const onPaginationChange = useCallback(
    (page, pageSize) => {
      dispatch({
        type: '$getTransferingList',
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
      type: '$getTransferingList',
    });
  }, [dispatch]);

  return (
    <AntdTable
      {...restTableOptions}
      columns={columns}
      loading={loadings.$getTransferingList}
      pagination={tablePagination}
    />
  );
};

export default connect(({ transfering, loadings }) => ({
  transfering,
  loadings,
}))(Transfering);
