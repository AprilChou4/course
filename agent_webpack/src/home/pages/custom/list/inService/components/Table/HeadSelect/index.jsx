// 表格头部模糊搜索
import React, { useCallback } from 'react';
import { connect } from 'nuomi';
import TableHeadSelect from '@components/TableHeadSelect';

const HeadSelect = (props) => {
  const { dispatch, field } = props;
  const select = useCallback(
    (value) => {
      dispatch({
        type: '$serviceCustomerList',
        payload: {
          [field]: value,
        },
      });
    },
    [dispatch, field],
  );

  return <TableHeadSelect onSelect={select} {...props} />;
};
export default connect(({ query, sorters }) => ({ query, sorters }))(HeadSelect);
