import React from 'react';
import { message } from 'antd';
import postMessageRouter from '@utils/postMessage';

const Operate = ({ record }) => {
  const look = () => {
    // planBillOrNot 是否有计划表 true 有 false  无
    if (!record.planBillOrNot) {
      message.warning('请完善应收单服务日期后查看');
      return false;
    }

    postMessageRouter({
      type: 'agentAccount/routerLocation',
      payload: {
        url: '/charge/collectionPlanList',
        query: {
          shouldReceiveId: record.shouldReceiveId,
        },
      },
    });
  };

  const style = {
    color: '#ccc',
  };
  const colorStyle = !record.planBillOrNot ? style : {};
  return (
    <a onClick={look} style={{ ...colorStyle }}>
      查看收款计划
    </a>
  );
};
export default Operate;
