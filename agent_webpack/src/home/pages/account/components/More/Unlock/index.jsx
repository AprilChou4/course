/* eslint-disable no-nested-ternary */
import React from 'react';
import { message } from 'antd';
import { connect } from 'nuomi';
import services from '../../../services';

const Unlock = ({ dataSource, selectedRowKeys, startDate, dispatch }) => {
  const validateAccount = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择账套');
      return false;
    }
    return true;
  };

  const handleClick = async () => {
    if (!validateAccount()) {
      return;
    }
    const accountIds = [];
    dataSource.forEach((item) => {
      if (selectedRowKeys.includes(item.accountId)) {
        accountIds.push(item.accountId);
      }
    });

    try {
      await services.unlock(
        { currentDate: startDate, accountIdList: accountIds },
        { loading: '正在解锁账套...' },
      );
      message.success('解锁成功！');
      dispatch({
        type: 'updateState',
        payload: {
          selectedRowKeys: [],
        },
      });
      dispatch({
        type: 'query',
      });
    } catch ({ data, status }) {
      const msg =
        status === 300
          ? data.length > 3
            ? `${data.map((item) => item.accountName).join('、')}等${
                data.length
              }个客户 已停止服务，解锁失败`
            : `${data
                .slice(0, 3)
                .map((item) => item.accountName)
                .join('、')} 已停止服务，解锁失败`
          : '操作失败！';
      message.error(msg);
    }
  };

  return <div onClick={handleClick}>解锁</div>;
};

export default connect(({ dataSource, selectedRowKeys, startDate }) => ({
  dataSource,
  selectedRowKeys,
  startDate,
}))(Unlock);
