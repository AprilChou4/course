/**
 * 新增按钮
 */
import React, { useCallback, useMemo } from 'react';
import { connect } from 'nuomi';
import { Button } from 'antd';
import { If } from '@components';
import { get } from '@utils';
import { dictionary } from '@pages/charge/receivable/utils';

const Add = ({ status, dispatch }) => {
  const statusData = useMemo(() => get(dictionary, `statusData.map.${status}`, {}), [status]);

  const handleClick = useCallback(() => {
    dispatch({
      type: 'handleNewReceivable',
    });
  }, [dispatch]);

  return (
    <If condition={statusData.add !== 2}>
      <Button disabled={statusData.add !== 0} onClick={handleClick}>
        新增
      </Button>
    </If>
  );
};

export default connect(({ status }) => ({ status }))(Add);
