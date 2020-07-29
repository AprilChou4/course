import React, { useMemo, useCallback } from 'react';
import { connect } from 'nuomi';
import { AntdTable, ShowConfirm } from '@components';

import getColumns from './columns';

const DataGride = ({ queryLoading, queryName, staffList, pagination, dispatch }) => {
  const handleApprove = useCallback(
    (record) => {
      dispatch({
        type: 'showApproveStaffModal',
        payload: {
          data: { staffModalType: 2, record: { ...record, staffId: record.userJoinCompanyId } },
        },
      });
    },
    [dispatch],
  );

  const handleReject = useCallback(
    ({ userJoinCompanyId }) => {
      ShowConfirm({
        title: `您确认拒绝该员工？`,
        content: '拒绝后可在“未通过”菜单中查看',
        okText: '拒绝',
        onOk() {
          return dispatch({
            type: '$rejectStaff',
            payload: {
              userJoinCompanyId,
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
        pagination,
        handleApprove,
        handleReject,
      }),
    [pagination, handleApprove, handleReject],
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
