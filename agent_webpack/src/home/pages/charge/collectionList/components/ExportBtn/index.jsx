/* eslint-disable no-param-reassign */
/**
 * 新增
 */
import React from 'react';
import ExportText from '@components/ExportText';
import { Button } from 'antd';
import { connect } from 'nuomi';

const ExportBtn = ({ tableConditions }) => {
  // 点击导出
  const { current, pageSize, ...query } = tableConditions;
  return (
    <>
      <ExportText
        className="f-fr"
        url={`${basePath}instead/v2/customer/receipt/receiveBill/export.do`}
        method="post"
        data={query}
      >
        <Button className="e-ml12">导出</Button>
      </ExportText>
    </>
  );
};

export default connect(({ tableConditions }) => ({ tableConditions }))(ExportBtn);
