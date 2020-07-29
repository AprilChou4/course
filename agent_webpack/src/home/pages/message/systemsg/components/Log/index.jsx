// 系统消息>操作日志
import React, { PureComponent } from 'react';
import { connect } from 'nuomi';
import Content from '@components/Content';
import LogTable from './LogTable';
import LogSearch from './LogSearch';
import Style from './style.less';

const { Head, Left } = Content;
class Log extends PureComponent {
  render() {
    const { displayType } = this.props;
    return (
      <React.Fragment>
        <Head className="f-clearfix">
          <Left>
            <LogSearch />
          </Left>
        </Head>
        <div className={Style['log-Body']}>
          <LogTable />
        </div>
      </React.Fragment>
    );
  }
}
export default connect(({ displayType }) => ({ displayType }))(Log);
