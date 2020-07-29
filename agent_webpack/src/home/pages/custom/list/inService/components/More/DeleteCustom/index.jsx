// 更多 > 删除
import React, { useCallback } from 'react';
import { message } from 'antd';
import { connect } from 'nuomi';
import ShowConfirm from '@components/ShowConfirm';

const DeleteCustom = ({ dispatch, selectedRowKeys }) => {
  // 删除客户
  const deleteCustom = useCallback(() => {
    if (!selectedRowKeys.length) {
      message.warning('请先选择要删除的客户');
      return false;
    }
    ShowConfirm({
      title: '你确定要删除所选客户信息吗？',
      width: 282,
      onOk() {
        dispatch({
          type: '$deleteCustomer',
          payload: {
            customerIdList: selectedRowKeys,
          },
        });
      },
    });
  }, [dispatch, selectedRowKeys]);

  return <div onClick={deleteCustom}>删除</div>;
};

export default connect(({ selectedRowKeys }) => ({ selectedRowKeys }))(DeleteCustom);
