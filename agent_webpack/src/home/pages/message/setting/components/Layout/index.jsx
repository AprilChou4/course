import React from 'react';
import { Tabs } from 'antd';
import { connect } from 'nuomi';
import CustomerGroup from '../CustomerGroup';
import MessageTemplate from '../MessageTemplate';
import TemplateModal from '../TemplateModal';
import GroupModal from '../GroupModal';
import BuiltInModal from '../BuiltInModal';

import './index.less';

const { TabPane } = Tabs;

function Layout({ tabKey, dispatch }) {
  const onChange = (activeKey) => {
    dispatch({
      type: 'updateState',
      payload: {
        tabKey: activeKey,
      },
    });
    if (activeKey === '0') {
      // 消息模板列表
      dispatch({
        type: '$getTemplateList',
      });
    } else if (activeKey === '1') {
      // 客户分组列表
      dispatch({
        type: '$getGroupList',
      });
      dispatch({
        type: '$getBuiltInGroupList',
      });
    }
  };

  return (
    <div styleName="message-setting">
      <Tabs animated={false} activeKey={tabKey} onChange={onChange}>
        <TabPane tab="消息模板" key="0">
          <MessageTemplate />
        </TabPane>
        <TabPane tab="客户分组" key="1">
          <CustomerGroup />
        </TabPane>
      </Tabs>
      <TemplateModal />
      <GroupModal />
      <BuiltInModal />
    </div>
  );
}

export default connect(({ tabKey, key }) => ({ tabKey, key }))(Layout);
