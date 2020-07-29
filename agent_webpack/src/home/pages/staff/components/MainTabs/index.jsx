import React, { useEffect, useCallback, useMemo } from 'react';
import { connect, Nuomi } from 'nuomi';
import pubData from 'data';
import { AntdTabs } from '@components';
import incumbency from '../../modules/incumbency';
import pending from '../../modules/pending';
import stopped from '../../modules/stopped';
import unpassed from '../../modules/unpassed';

const userAuth = pubData.get('authority');

const MainTabs = ({
  mainTabActiveKey,
  moduleCounts: { pending: pendingCounts, unpassed: unpassedCounts },
  dispatch,
}) => {
  const tabPanes = useMemo(
    () =>
      [
        {
          key: 'incumbency',
          name: '在职',
          content: <Nuomi {...incumbency} />,
        },
        {
          key: 'pending',
          name: '待审批',
          badge: {
            count: pendingCounts,
          },
          hidden: !userAuth[43],
          content: <Nuomi {...pending} />,
        },
        {
          key: 'stopped',
          name: '已停用',
          hidden: !userAuth[40],
          content: <Nuomi {...stopped} />,
        },
        {
          key: 'unpassed',
          name: '未通过',
          hidden: !unpassedCounts || !userAuth[43],
          content: <Nuomi {...unpassed} />,
        },
      ].filter(({ hidden }) => !hidden),
    [pendingCounts, unpassedCounts],
  );

  const handleTabsChange = useCallback(
    (activeKey) => {
      dispatch({
        type: 'updateState',
        payload: {
          mainTabActiveKey: activeKey,
        },
      });
      dispatch({
        type: `staff_${activeKey}/query`,
      });
    },
    [dispatch],
  );

  useEffect(() => {
    dispatch({
      type: 'getReviewNum',
    });
  }, [dispatch, mainTabActiveKey]);

  return <AntdTabs tabPanes={tabPanes} activeKey={mainTabActiveKey} onChange={handleTabsChange} />;
};

export default connect(({ mainTabActiveKey, moduleCounts }) => ({
  mainTabActiveKey,
  moduleCounts,
}))(MainTabs);
