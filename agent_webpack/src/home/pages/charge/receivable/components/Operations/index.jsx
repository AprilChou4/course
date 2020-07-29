/**
 * 操作按钮
 */
import React from 'react';
import { ConfigProvider } from 'antd';
import Save from './Save';
import Add from './Add';
import SaveAdd from './SaveAdd';
import Delete from './Delete';
import CollectionPlan from './CollectionPlan';

const Operations = () => {
  return (
    <ConfigProvider autoInsertSpaceInButton={false}>
      <Save />
      <Add />
      <SaveAdd />
      <Delete />
      <CollectionPlan />
    </ConfigProvider>
  );
};

export default Operations;
