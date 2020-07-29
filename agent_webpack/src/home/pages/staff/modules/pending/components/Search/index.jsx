import React, { useCallback } from 'react';
import { connect } from 'nuomi';
import CommonSearch from '@pages/staff/components/Search';

const Search = ({ name, dispatch }) => {
  const handleChange = useCallback(
    (e) => {
      const { value } = e.target;
      dispatch({
        type: 'updateState',
        payload: {
          name: value,
        },
      });
    },
    [dispatch],
  );

  const handleSearch = useCallback(
    (value) => {
      dispatch({
        type: 'updateQuery',
        payload: { query: { name: value } },
      });
    },
    [dispatch],
  );

  return <CommonSearch value={name} onChange={handleChange} onSearch={handleSearch} />;
};

export default connect(({ name }) => ({ name }))(Search);
