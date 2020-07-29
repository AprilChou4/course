import React, { useCallback, useMemo } from 'react';
import { Tabs, Radio } from 'antd';
import { connect } from 'nuomi';
import AccountReceive from './AccountReceive';
import AccountTransfer from './AccountTransfer';
import './style.less';
import AssignAccounting from '../AssignAccounting';

const { TabPane } = Tabs;
const { Group: RadioGroup, Button: RadioButton } = Radio;
const tabsOptions = [
  { label: '账套移交', value: 'transfer' },
  { label: '账套接收', value: 'receive' },
];

const Content = ({ activeKey, assignAccountingVisible, dispatch }) => {
  const tabBar = useMemo(
    () =>
      tabsOptions.map(({ value, label }) => (
        <RadioButton key={value} value={value}>
          {label}
        </RadioButton>
      )),
    [],
  );
  const handleTabsChange = useCallback(
    (e) => {
      const { value } = e.target;
      dispatch({
        type: 'updateState',
        payload: {
          activeKey: value,
        },
      });
    },
    [dispatch],
  );

  return (
    <>
      <div styleName="tabsBar">
        <RadioGroup buttonStyle="solid" value={activeKey} onChange={handleTabsChange}>
          {tabBar}
        </RadioGroup>
      </div>
      <div styleName="tabsContent">
        <Tabs animated={false} activeKey={activeKey}>
          <TabPane tab="账套移交" key="transfer">
            <AccountTransfer />
          </TabPane>
          <TabPane tab="账套接收" key="receive">
            <AccountReceive />
          </TabPane>
        </Tabs>
      </div>
      {assignAccountingVisible && <AssignAccounting />}
    </>
  );
};

export default connect(({ activeKey, assignAccounting: { visible: assignAccountingVisible } }) => ({
  activeKey,
  assignAccountingVisible,
}))(Content);
