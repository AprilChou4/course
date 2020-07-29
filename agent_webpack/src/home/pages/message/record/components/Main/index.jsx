// tab标签
import React, { PureComponent, Fragment } from 'react';
import { Tabs, Badge } from 'antd';
import { connect } from 'nuomi';
// import actions from '../../store/actions';
import Tabcont from '../Tabcont';
import DetailModal from '../DetailModal';
import Style from './style.less';

const { TabPane } = Tabs;

class Main extends PureComponent {
  // 切换tab
  changeTab = (key) => {
    const { dispatch } = this.props;
    const urlType = ['$getTimingList', '$getSuccessList', '$getFailedList'][Number(key) - 1];
    dispatch({
      type: urlType,
      payload: {
        current: 1,
      },
    });
    dispatch({
      type: 'updateState',
      payload: {
        tabType: key,
        displayType: 0,
        current: 1,
        query: {},
      },
    });
  };

  render() {
    const { tabType, isDetailVisible, redCount } = this.props;
    return (
      <div className={Style['msgRecord-tab']}>
        <Tabs activeKey={tabType} onChange={this.changeTab} animated={false}>
          <TabPane tab="定时发送" key="1">
            {tabType === '1' && <Tabcont />}
          </TabPane>
          <TabPane tab="发送成功" key="2">
            {tabType === '2' && <Tabcont />}
          </TabPane>
          <TabPane
            tab={
              <Fragment>
                发送失败
                <Badge
                  className={Style['m-tip']}
                  count={redCount}
                  overflowCount={99}
                  style={{ backgroundColor: '#F6A327' }}
                />
              </Fragment>
            }
            key="3"
          >
            {tabType === '3' && <Tabcont />}
          </TabPane>
        </Tabs>
        {isDetailVisible && <DetailModal />}
      </div>
    );
  }
}
export default connect(({ tabType, isDetailVisible, redCount, key }) => ({
  tabType,
  isDetailVisible,
  redCount,
  key,
}))(Main);
