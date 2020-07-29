// 消息记录>tab主体
import React, { useEffect } from 'react';
import { connect } from 'nuomi';

import Content from '@components/Content';
import Search from '../Search';
import AssignBtn from '../AssignBtn';
import AddCustom from '../AddCustom';
import More from '../More';

import InServiceTable from '../Table';
import FollowUp from '../FollowUp'; // 跟进弹窗
import EstablishAccount from '../EstablishAccount'; // 建账弹窗
import OpenAccountModal from '../OpenAccountModal'; // 开户弹窗
import ImportProgress from '../More/ThirdImport/ImportProcess'; // 第三方导入进度条
import Style from './style.less';

const { Head, Left, Right } = Content;

const Main = ({ dispatch }) => {
  useEffect(() => {
    dispatch({
      type: '$judgeBatchImportTask',
    });
  }, [dispatch]);

  return (
    <>
      <Head className="f-clearfix">
        <Left>
          <Search />
          <ImportProgress />
        </Left>
        <Right>
          <AddCustom />
          <AssignBtn />
          <More />
        </Right>
      </Head>
      <div className={Style['m-customBody']}>
        <InServiceTable />
      </div>
      <FollowUp />
      <EstablishAccount />
      <OpenAccountModal />
    </>
  );
};
export default connect(({ tabType }) => ({ tabType }))(Main);
