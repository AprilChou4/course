import React, { PureComponent } from 'react';
import { Menu, Dropdown } from 'antd';
import PropTypes from 'prop-types';
import Style from './style.less';

class FilterDropdown extends PureComponent {
  render() {
    const { fieldName, list, menuClick } = this.props;
    const menu = (
      // Dropdown 下的 Menu 默认不可选中。如果需要菜单可选中，可以指定 <Menu selectable>
      <Menu selectable onClick={menuClick}>
        {list.map((item) => (
          <Menu.Item key={item.value} data={item}>
            {item.title}
          </Menu.Item>
        ))}
      </Menu>
    );
    return (
      <Dropdown
        className="message-record-filterTitle"
        overlay={menu}
        trigger={['click']}
        placement="bottomCenter"
        overlayClassName={Style.filterDown}
        // getPopupContainer={ trigger => trigger.parentNode }
      >
        <a>
          <span>{fieldName}</span>
          <i className="iconfont f-fs13 e-ml5">&#xe688;</i>
        </a>
      </Dropdown>
    );
  }
}
FilterDropdown.defaultProps = {
  /**
   * @func 点击菜单
   */
  menuClick() {},
};

FilterDropdown.propTypes = {
  menuClick: PropTypes.func,
};

export default FilterDropdown;
