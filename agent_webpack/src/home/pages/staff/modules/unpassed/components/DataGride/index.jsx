import React, { useMemo, useCallback } from 'react';
import { connect } from 'nuomi';
import { AntdTable } from '@components';
import getColumns from './columns';

const DataGride = ({ queryLoading, queryName, staffList, pagination, dispatch }) => {
  const handleModify = useCallback(
    (record) => {
      dispatch({
        type: 'editStaff',
        payload: {
          data: record,
          visible: true,
        },
      });
    },
    [dispatch],
  );

  const columns = useMemo(
    () =>
      getColumns({
        pagination,
        handleModify,
      }),
    [pagination, handleModify],
  );

  const handleTableChange = useCallback(
    ({ current, pageSize }, filters = {}) => {
      dispatch({
        type: 'query',
        payload: {
          current,
          pageSize,
          ...filters,
        },
      });
    },
    [dispatch],
  );

  return (
    <AntdTable
      bordered
      rowKey="staffId"
      scroll={{ y: true }}
      columns={columns}
      dataSource={staffList}
      pagination={pagination}
      loading={queryLoading}
      onChange={handleTableChange}
      locale={queryName ? { emptyText: `未找到与“${queryName}”相关的数据` } : {}}
    />
  );
};

export default connect(
  ({ loadings: { $query: queryLoading }, query: { name: queryName }, staffList, pagination }) => ({
    queryLoading,
    queryName,
    staffList,
    pagination,
  }),
)(DataGride);
