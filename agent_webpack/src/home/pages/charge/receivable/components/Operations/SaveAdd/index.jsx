/**
 * 保存并新增按钮
 */
import React, { useCallback, useMemo } from 'react';
import { connect } from 'nuomi';
import { Button } from 'antd';
import { If } from '@components';
import { get } from '@utils';
import { dictionary } from '@pages/charge/receivable/utils';

const SaveAdd = ({ status, dispatch }) => {
  const statusData = useMemo(() => get(dictionary, `statusData.map.${status}`, {}), [status]);

  const handleClick = useCallback(() => {
    dispatch({
      type: '$saveReceivable',
      payload: {
        toNew: true,
      },
    });
  }, [dispatch]);

  return (
    <If condition={statusData.saveAdd !== 2}>
      <Button disabled={statusData.saveAdd !== 0} onClick={handleClick}>
        保存并新增
      </Button>
    </If>
  );
};

export default connect(({ status }) => ({ status }))(SaveAdd);
