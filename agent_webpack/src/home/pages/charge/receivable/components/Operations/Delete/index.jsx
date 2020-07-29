/**
 * 删除按钮
 */
import React, { useCallback, useMemo } from 'react';
import { connect } from 'nuomi';
import { Button } from 'antd';
import { If, ShowConfirm } from '@components';
import { get } from '@utils';
import { dictionary } from '@pages/charge/receivable/utils';

const Delete = ({ status, dispatch }) => {
  const statusData = useMemo(() => get(dictionary, `statusData.map.${status}`, {}), [status]);

  const handleClick = useCallback(() => {
    ShowConfirm({
      title: '你确定要删除此应收单吗？',
      onOk() {
        dispatch({
          type: '$deleteReceivable',
        });
      },
    });
  }, [dispatch]);

  return (
    <If condition={statusData.delete !== 2}>
      <Button disabled={statusData.delete !== 0} onClick={handleClick}>
        删除
      </Button>
    </If>
  );
};

export default connect(({ status }) => ({ status }))(Delete);
