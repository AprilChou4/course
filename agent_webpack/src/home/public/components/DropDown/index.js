import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Dropdown, Menu, Button, Icon } from 'antd';
import classnames from 'classnames';
import './style.less';

// 目前已经满足需求，暂时不支持外部传入的visible，否则要判断组件是可控/不可控
const DropDownBtn = ({ className, style, text = '更多', children, onVisibleChange, ...rest }) => {
  const [visible, setVisible] = useState(false);

  const handleVisibleChange = useCallback((status) => {
    setVisible(status);
  }, []);

  const handleMenuClick = useCallback(() => {
    setVisible(false);
  }, []);

  const overlay = useMemo(
    () => (
      <Menu className={classnames('ui-ant-dropdown-menu', className)} onClick={handleMenuClick}>
        {Array.isArray(children) ? (
          children.map((ele, i) =>
            ele ? (
              <Menu.Item key={i} disabled={ele.props.disabled}>
                {ele}
              </Menu.Item>
            ) : (
              undefined
            ),
          )
        ) : (
          <Menu.Item disabled={children.props.disabled}>{children}</Menu.Item>
        )}
      </Menu>
    ),
    [children, className, handleMenuClick],
  );

  useEffect(() => {
    onVisibleChange && onVisibleChange(visible);
  }, [onVisibleChange, visible]);
  return children && children.length ? (
    <Dropdown
      placement="bottomRight"
      {...rest}
      visible={visible}
      overlay={overlay}
      onVisibleChange={handleVisibleChange}
    >
      <Button style={style}>
        {text} <Icon type={visible ? 'up' : 'down'} className="f-fs12" />
      </Button>
    </Dropdown>
  ) : (
    <>
      <Button style={style}>{children}</Button>
    </>
  );
};

export default DropDownBtn;
