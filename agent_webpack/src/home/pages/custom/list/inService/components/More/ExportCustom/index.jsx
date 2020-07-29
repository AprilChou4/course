// 更多 > 导出
import React from 'react';
import { connect } from 'nuomi';
import ExportText from '@components/ExportText';

const ExportCustom = ({ query }) => {
  const param = { ...query };
  return (
    <ExportText url={`${basePath}instead/v2/customer/export.do`} data={param}>
      导出
    </ExportText>
  );
};

export default connect(({ query }) => ({ query }))(ExportCustom);
