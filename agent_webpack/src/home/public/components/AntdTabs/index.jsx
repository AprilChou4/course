import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Tabs, Badge } from 'antd';
import './style.less';

const { TabPane } = Tabs;

const AntdTabs = ({ tabPanes, className, ...restProps }) => {
  const tabContent = useMemo(
    () =>
      tabPanes.map(({ key, name, badge, content, hidden, ...restTabPanesProps }, index) => (
        <TabPane
          key={key || index}
          tab={
            badge ? (
              <Badge {...badge} className={classnames('antdTabs-badge', badge.className)}>
                {name}
              </Badge>
            ) : (
              name
            )
          }
          {...restTabPanesProps}
        >
          {content}
        </TabPane>
      )),
    [tabPanes],
  );

  return (
    <Tabs animated={false} className={classnames('antdTabs', className)} {...restProps}>
      {tabContent}
    </Tabs>
  );
};

AntdTabs.propTypes = {
  tabPanes: PropTypes.arrayOf(
    PropTypes.shape({
      badge: PropTypes.object,
    }),
  ).isRequired,
};

export default AntdTabs;
