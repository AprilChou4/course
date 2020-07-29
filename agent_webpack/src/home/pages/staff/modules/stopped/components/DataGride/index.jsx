import React, { useMemo, useCallback } from 'react';
import { connect } from 'nuomi';
import { AntdTable, ShowConfirm } from '@components';
import getColumns from './columns';
import styles from './style.less';

const DataGride = ({ queryLoading, queryName, staffList, rolesList, pagination, dispatch }) => {
  const handleEnable = useCallback(
    (record) => {
      dispatch({
        type: '$enableStaff',
        payload: {
          record,
        },
      });
    },
    [dispatch],
  );

  const handleDelete = useCallback(
    (record) => {
      ShowConfirm({
        title: `确定要删除该员工吗？`,
        onOk() {
          return dispatch({
            type: '$deleteStaff',
            payload: {
              staffId: record.staffId,
            },
          });
        },
      });
    },
    [dispatch],
  );

  const columns = useMemo(
    () =>
      getColumns({
        rolesList,
        pagination,
        handleEnable,
        handleDelete,
      }),
    [rolesList, pagination, handleEnable, handleDelete],
  );

  const handleTableChange = useCallback(
    ({ current, pageSize }, filters) => {
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
      className={styles.table}
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
  ({
    loadings: { $query: queryLoading },
    query: { name: queryName },
    staffList,
    pagination,
    rolesList,
  }) => ({
    queryLoading,
    queryName,
    staffList,
    pagination,
    rolesList,
  }),
)(DataGride);
