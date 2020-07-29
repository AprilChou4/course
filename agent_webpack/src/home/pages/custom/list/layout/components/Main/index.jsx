// tab标签
import React, { Component } from 'react';
import { Tabs } from 'antd';
import { connect, Nuomi } from 'nuomi';
import inService from '../../../inService';
import offService from '../../../offService';
import Style from './style.less';

const { TabPane } = Tabs;
class Main extends Component {
  // 切换tab
  changeTab = (key) => {
    const { dispatch, isNeedRefresh } = this.props;
    if (isNeedRefresh) {
      const url =
        key === '1'
          ? 'custom_inService/$serviceCustomerList'
          : 'custom_offService/$stopCustomerList';
      dispatch({
        type: url,
      });
    }
    dispatch({
      type: 'updateState',
      payload: {
        tabType: key,
        isNeedRefresh: false,
      },
    });
  };

  render() {
    const { tabType } = this.props;
    return (
      <div className={Style['custom-tab']}>
        <Tabs activeKey={tabType} onChange={this.changeTab} animated={false}>
          <TabPane tab="服务中客户" key="1">
            <Nuomi {...inService} />
          </TabPane>
          <TabPane tab="停止服务客户" key="2">
            <Nuomi {...offService} />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}
export default connect(({ key, tabType, isNeedRefresh }) => ({
  key,
  tabType,
  isNeedRefresh,
}))(Main);
