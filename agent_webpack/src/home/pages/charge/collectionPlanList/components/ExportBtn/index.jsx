/* eslint-disable no-param-reassign */
/**
 * 新增
 */
import React from 'react';
import ExportText from '@components/ExportText';
import { Button } from 'antd';
import { connect, router } from 'nuomi';

const ExportBtn = ({ tableType, query }) => {
  const {
    query: { shouldReceiveId },
  } = router.location();
  // 点击导出
  const params = {
    ...query,
    shouldReceiveId,
  };
  const url = tableType
    ? `${basePath}instead/v2/customer/receipt/shouldReceiveBill/planList/export.do`
    : `${basePath}instead/v2/customer/receipt/shouldReceiveBill/planDetailList/export.do`;
  return (
    <>
      <ExportText className="f-fr" url={url} method="post" data={params}>
        <Button className="e-ml12">导出</Button>
      </ExportText>
    </>
  );
};

export default connect(({ tableType, query }) => ({
  tableType,
  query,
}))(ExportBtn);
