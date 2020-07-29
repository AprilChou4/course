/**
 * 下拉按钮组
 *
 * 注意：children中不要使用Authority组件，会导致children长度判断出问题
 */
import React, { forwardRef, useState, useEffect, useCallback, useMemo } from 'react';
import { Dropdown, Menu, Button, Icon, Divider } from 'antd';
import classnames from 'classnames';
import If from '../If';
import './style.less';

const { Item: MenuItem } = Menu;

const DropDownButton = forwardRef(
  ({ overlayClassName, children, onVisibleChange, ...rest }, ref) => {
    const [visible, setVisible] = useState(false);

    const realChildren = useMemo(
      () => (children && Array.isArray(children) ? children.filter(Boolean) : children),
      [children],
    );

    const handleVisibleChange = useCallback((status) => {
      setVisible(status);
    }, []);

    const handleMenuClick = useCallback(() => {
      setVisible(false);
    }, []);

    const overlay = useMemo(
      () =>
        realChildren && Array.isArray(realChildren) ? (
          <Menu className="antd-dropdown-button-menu" onClick={handleMenuClick}>
            {realChildren
              .filter((item, index) => item && index !== 0)
              .map((item, index) => (
                <MenuItem key={index} {...(item.props || {})}>
                  {item}
                </MenuItem>
              ))}
          </Menu>
        ) : null,
      [realChildren, handleMenuClick],
    );

    useEffect(() => {
      onVisibleChange && onVisibleChange(visible);
    }, [onVisibleChange, visible]);

    return (
      <If condition={realChildren && !(Array.isArray(realChildren) && !realChildren.length)}>
        {Array.isArray(realChildren) ? (
          <span ref={ref} className="antd-dropdown-button">
            <Button type="primary">{realChildren[0]}</Button>
            <Divider type="vertical" style={{ margin: 0 }} />
            <Dropdown
              placement="bottomRight"
              trigger={['click']}
              {...rest}
              visible={visible}
              overlay={overlay}
              overlayStyle={{ minWidth: '100%' }}
              overlayClassName={classnames('antd-dropdown-button-overlay', overlayClassName)}
              getPopupContainer={(triggerNode) => triggerNode.parentNode}
              onVisibleChange={handleVisibleChange}
            >
              <Button type="primary">
                <Icon type="down" className="f-fs12" />
              </Button>
            </Dropdown>
          </span>
        ) : (
          <Button type="primary">{realChildren}</Button>
        )}
      </If>
    );
  },
);

export default DropDownButton;
