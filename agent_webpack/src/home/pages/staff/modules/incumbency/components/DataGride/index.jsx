import React, { useMemo, useCallback } from 'react';
import { connect } from 'nuomi';
import { AntdTable, ShowConfirm } from '@components';
import { postMessage } from '@utils';
import getColumns from './columns';
import styles from './style.less';

const DataGride = ({ queryLoading, queryName, staffList, rolesList, pagination, dispatch }) => {
  const handleEdit = useCallback(
    (record) => {
      dispatch({
        type: 'showAddEditStaffModal',
        payload: {
          data: { staffModalType: 1, record },
        },
      });
    },
    [dispatch],
  );

  // 管理员修改自己
  const handleAdminEditSelf = useCallback(
    (record) => {
      dispatch({
        type: 'showAdminEditSelfModal',
        payload: {
          data: { staffModalType: 3, record },
        },
      });
    },
    [dispatch],
  );

  const handleStop = useCallback(
    (record) => {
      dispatch({
        type: 'handleStopStaff',
        payload: {
          record,
        },
      });
    },
    [dispatch],
  );

  const handleAuth = useCallback((record) => {
    postMessage({
      type: 'agentAccount/routerLocation',
      payload: {
        url: '/authCenter/1',
        pubData: {
          toAuthId: record.staffId,
        },
      },
    });
  }, []);

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
        handleEdit,
        handleAdminEditSelf,
        handleStop,
        handleAuth,
        handleDelete,
      }),
    [rolesList, pagination, handleEdit, handleAdminEditSelf, handleStop, handleAuth, handleDelete],
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
