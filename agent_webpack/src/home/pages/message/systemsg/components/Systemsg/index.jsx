// 系统消息>系统消息
import React, { PureComponent } from 'react';
import { connect } from 'nuomi';
import Content from '@components/Content';
import Msgtype from './Msgtype';
import MsgButton from './MsgButton';
import SystemTable from './SystemTable';
import SystemDetail from './SystemDetail';
import Style from './style.less';

const { Head, Left, Right } = Content;
class TabCont extends PureComponent {
  render() {
    const { displayType } = this.props;
    return (
      <React.Fragment>
        {displayType === 0 && (
          <Head className="f-clearfix">
            <Left>
              <Msgtype />
            </Left>
            <Right>
              <MsgButton />
            </Right>
          </Head>
        )}
        <div
          className={`${Style['system-Body']} ${displayType === 1 && Style['system-detailBody']}`}
        >
          {displayType === 0 ? <SystemTable /> : <SystemDetail />}
        </div>
      </React.Fragment>
    );
  }
}
export default connect(({ displayType }) => ({ displayType }))(TabCont);
