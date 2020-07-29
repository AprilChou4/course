// 消息记录>tab主体
import React, { PureComponent } from 'react';
import { connect } from 'nuomi';
import Content from '@components/Content';
import MoreSearch from '../MoreSearch';
import MsgButton from '../MsgButton';
import { SendTable, FailTable, SuccessTable } from '../Table';
import SuccFailDetail from '../SuccFailDetail';
import EditSendMsg from '../EditSendMsg';
import Style from './style.less';

const { Head, Left, Right } = Content;
class TabCont extends PureComponent {
  render() {
    const { tabType, displayType } = this.props;
    let currComponent;
    if (tabType === '1') {
      currComponent = [<SendTable />, <EditSendMsg />][displayType];
    } else if (tabType === '2') {
      currComponent = [<SuccessTable />, <SuccFailDetail />][displayType];
    } else {
      currComponent = [<FailTable />, <SuccFailDetail />][displayType];
    }
    return (
      <React.Fragment>
        {displayType === 0 ? (
          <Head className="f-clearfix">
            <Left>
              <MoreSearch />
            </Left>
            <Right>
              <MsgButton />
            </Right>
          </Head>
        ) : (
          ''
        )}
        <div
          className={`${Style['m-msgrecordBody']} ${displayType === 1 && Style['m-Detailbody']}`}
        >
          {currComponent}
        </div>
      </React.Fragment>
    );
  }
}
export default connect(({ tabType, displayType }) => ({ tabType, displayType }))(TabCont);
