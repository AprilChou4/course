import React, { forwardRef, useState, useLayoutEffect, useCallback, useMemo } from 'react';
import { Checkbox, Row } from 'antd';
import pubData from 'data';
import globalServices from '@home/services';
import { If } from '@components';

const { Group: CheckboxGroup } = Checkbox;

const RolesList = forwardRef((props, ref) => {
  const isManage = pubData.get('userInfo_staffId');
  const [roles, setRoles] = useState([]);

  const getRoles = useCallback(async () => {
    const data = await globalServices.getRolesList();
    setRoles(data);
  }, []);

  const getContent = useCallback(
    (list) =>
      list.map(({ roleId, roleName }, index) => (
        <Checkbox value={roleId || index} key={roleId} disabled={!roleId}>
          {roleName}
        </Checkbox>
      )),
    [],
  );

  const contentTop = useMemo(
    () => getContent(roles.filter(({ roleName }) => roleName === '公司管理员')),
    [getContent, roles],
  );

  const contentMain = useMemo(
    () => getContent(roles.filter(({ roleName }) => roleName !== '公司管理员')),
    [getContent, roles],
  );

  useLayoutEffect(() => {
    getRoles();
  }, [getRoles]);

  return (
    <CheckboxGroup {...props} ref={ref}>
      <If condition={isManage}>
        <Row>{contentTop}</Row>
      </If>
      <Row>{contentMain}</Row>
    </CheckboxGroup>
  );
});

export default RolesList;
