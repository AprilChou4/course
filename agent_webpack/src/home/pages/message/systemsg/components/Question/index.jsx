// 系统消息>系统消息
import React, { PureComponent } from 'react';
import { connect } from 'nuomi';
import QuestionTable from './QuestionTable';
import QuesDetail from './QuesDetail';
import Style from './style.less';

class TabCont extends PureComponent {
  render() {
    const { displayType } = this.props;
    return (
      <React.Fragment>
        <div
          className={`${Style['system-Body']} ${displayType === 1 && Style['system-detailBody']}`}
        >
          {displayType === 0 ? <QuestionTable /> : <QuesDetail />}
        </div>
      </React.Fragment>
    );
  }
}
export default connect(({ displayType }) => ({ displayType }))(TabCont);
