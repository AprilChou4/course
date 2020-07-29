import React, { useCallback } from 'react';
import { connect } from 'nuomi';
import TableHeadSearch from '@components/TableHeadSearch';
import './style.less';

const HeadSearch = (props) => {
  const { dispatch } = props;
  const search = useCallback(
    (data) => {
      dispatch({
        type: '$serviceCustomerList',
        payload: {
          ...data,
        },
      });
    },
    [dispatch],
  );
  return <TableHeadSearch onSearch={search} {...props} />;
};
export default connect()(HeadSearch);
