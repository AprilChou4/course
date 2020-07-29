// 消息记录>tab主体
import React, { PureComponent } from 'react';
import { connect } from 'nuomi';

import Content from '@components/Content';
import Search from '../Search';
import OffServiceTable from '../Table';
import RenewModal from '../RenewModal';
import Style from './style.less';

const { Head, Left } = Content;
class Main extends PureComponent {
  render() {
    return (
      <>
        <Head className="f-clearfix">
          <Left>
            <Search />
          </Left>
        </Head>
        <div className={Style['m-customBody']}>
          <OffServiceTable />
        </div>
        <RenewModal />
      </>
    );
  }
}
export default connect(({ tabType }) => ({ tabType }))(Main);
