/**
 * 收款计划表按钮
 */
import React, { useCallback } from 'react';
import { connect } from 'nuomi';
import { Button, message } from 'antd';
import { If } from '@components';
import { postMessageRouter } from '@utils';

const CollectionPlan = ({ form, formInitialValues }) => {
  const { shouldReceiveId } = form ? form.getFieldsValue() || {} : {};
  const { planBillOrNot } = formInitialValues;

  const handleClick = useCallback(() => {
    if (!planBillOrNot) {
      message.warning('请完善应收单服务日期后查看');
      return;
    }

    postMessageRouter({
      type: 'agentAccount/routerLocation',
      payload: {
        url: '/charge/collectionPlanList',
        query: {
          shouldReceiveId,
        },
      },
    });
  }, [planBillOrNot, shouldReceiveId]);

  return (
    <If condition={!!shouldReceiveId}>
      <Button onClick={handleClick}>收款计划表</Button>
    </If>
  );
};

export default connect(({ form, formInitialValues }) => ({ form, formInitialValues }))(
  CollectionPlan,
);
