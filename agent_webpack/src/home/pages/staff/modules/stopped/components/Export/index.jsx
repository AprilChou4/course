import React, { useMemo } from 'react';
import { connect } from 'nuomi';
import CommonExport from '@pages/staff/components/Export';

const Export = ({ name, roleIds }) => {
  const params = useMemo(
    () => ({ name, roleIds, url: 'instead/v2/user/staff/exportStopStaffList' }),
    [name, roleIds],
  );

  return (
    <CommonExport style={{ marginLeft: 12 }} params={params}>
      导出
    </CommonExport>
  );
};

export default connect(({ query: { name, roleIds } }) => ({ name, roleIds }))(Export);
