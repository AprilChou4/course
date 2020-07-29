// tab标签
import React, { PureComponent } from 'react';
import { Tabs, Badge } from 'antd';
import { connect } from 'nuomi';
import Systemsg from '../Systemsg';
import Question from '../Question';
import Advise from '../Advise';

import Log from '../Log';
import Style from './style.less';

const { TabPane } = Tabs;

class Main extends PureComponent {
  // 切换tab
  changeTab = (key) => {
    const { dispatch } = this.props;
    const urlType = ['$getSystemsgList', '$getQuesList', '', '$getLogList'][Number(key) - 1];
    if (key !== '3') {
      dispatch({
        type: urlType,
        payload: {
          current: 1,
        },
      });
    }
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
    const { tabType, noticeNum } = this.props;
    return (
      <div className={Style['systemMsg-tab']}>
        <Tabs
          activeKey={tabType}
          tabBarExtraContent={
            <Badge
              className={Style['m-tip']}
              count={noticeNum}
              overflowCount={99}
              style={{ backgroundColor: '#F6A327' }}
            />
          }
          onChange={this.changeTab}
          animated={false}
        >
          <TabPane tab="系统消息" key="1">
            {tabType === '1' && <Systemsg />}
          </TabPane>
          <TabPane tab="我的提问" key="2">
            {tabType === '2' && <Question />}
          </TabPane>
          <TabPane tab="建议反馈" key="3">
            {tabType === '3' && <Advise />}
          </TabPane>
          <TabPane tab="操作日志" key="4">
            {tabType === '4' && <Log />}
          </TabPane>
        </Tabs>
      </div>
    );
  }
}
export default connect(({ tabType, noticeNum }) => ({
  tabType,
  noticeNum,
}))(Main);
