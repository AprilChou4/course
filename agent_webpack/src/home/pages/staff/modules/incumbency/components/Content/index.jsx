import React from 'react';
import classnames from 'classnames';
import { Layout, ContentWrapper } from '@components';
import DepartmentOperations from '../Department/Operation';
import DepartmentList from '../Department/List';
import DataGride from '../DataGride';
import styles from './style.less';

const { Left, BFCContent } = Layout;

const Content = () => {
  return (
    <>
      <Left className={classnames('f-htp', styles.sider)}>
        <ContentWrapper
          header={<DepartmentOperations />}
          headerStyle={{ paddingBottom: 9 }}
          content={<DepartmentList />}
        />
      </Left>
      <BFCContent className="f-htp" style={{ paddingLeft: 15 }}>
        <DataGride />
      </BFCContent>
    </>
  );
};

export default Content;
