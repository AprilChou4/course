import React, { useMemo } from 'react';
import { connect } from 'nuomi';
import CommonExport from '@pages/staff/components/Export';

const Export = ({ name, deptId, roleIds }) => {
  const params = useMemo(
    () => ({
      name,
      deptId,
      roleIds,
      url: 'instead/v2/user/staff/exportServiceStaffList',
    }),
    [deptId, name, roleIds],
  );

  return (
    <CommonExport style={{ marginLeft: 12 }} params={params}>
      导出
    </CommonExport>
  );
};

export default connect(({ query: { name, deptId, roleIds } }) => ({ name, deptId, roleIds }))(
  Export,
);
