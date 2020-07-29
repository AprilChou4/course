/**
 * 保存按钮
 */
import React, { useCallback, useMemo } from 'react';
import { connect } from 'nuomi';
import { Button } from 'antd';
import { If } from '@components';
import { get } from '@utils';
import { dictionary } from '@pages/charge/receivable/utils';

const Save = ({ status, addLoading, dispatch }) => {
  const statusData = useMemo(() => get(dictionary, `statusData.map.${status}`, {}), [status]);

  const handleClick = useCallback(() => {
    dispatch({
      type: '$saveReceivable',
    });
  }, [dispatch]);

  return (
    <If condition={statusData.save !== 2}>
      <Button
        type="primary"
        loading={addLoading}
        disabled={statusData.save !== 0}
        onClick={handleClick}
      >
        保存
      </Button>
    </If>
  );
};

export default connect(({ status, loadings: { $addReceivable: addLoading } }) => ({
  status,
  addLoading,
}))(Save);
