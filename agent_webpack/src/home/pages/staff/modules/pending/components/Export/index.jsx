import React, { useMemo } from 'react';
import { connect } from 'nuomi';
import CommonExport from '@pages/staff/components/Export';

const Export = ({ name }) => {
  const params = useMemo(
    () => ({ name, url: 'instead/v2/user/staff/review/exportApplicationStaffList' }),
    [name],
  );

  return (
    <CommonExport style={{ marginLeft: 12 }} params={params}>
      导出
    </CommonExport>
  );
};

export default connect(({ query: { name } }) => ({ name }))(Export);
