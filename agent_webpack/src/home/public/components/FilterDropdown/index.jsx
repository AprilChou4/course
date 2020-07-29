import React, { PureComponent } from 'react';
import { Menu, Dropdown } from 'antd';
import PropTypes from 'prop-types';
import './style.less';

class FilterDropdown extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      checked: Boolean(props.defaultSelectedKeys),
    };
  }

  handleClick = (data) => {
    const { menuClick } = this.props;
    const { key } = data;
    const checked = key !== '-1';
    this.setState({
      checked,
    });
    menuClick(data);
  };

  render() {
    const { fieldName, list, menuClick, defaultSelectedKeys } = this.props;
    const { checked } = this.state;
    const menu = (
      // Dropdown 下的 Menu 默认不可选中。如果需要菜单可选中，可以指定 <Menu selectable>
      <Menu selectable onClick={this.handleClick} defaultSelectedKeys={defaultSelectedKeys}>
        {list.map((item) => (
          <Menu.Item key={item.value} data={item}>
            {item.title}
          </Menu.Item>
        ))}
      </Menu>
    );
    return (
      <Dropdown
        className="ui-filterTitle"
        overlay={menu}
        trigger={['click']}
        placement="bottomCenter"
        overlayClassName="ui-filterDown-menu"
        // getPopupContainer={ trigger => trigger.parentNode }
      >
        <a className>
          <span>{fieldName}</span>
          <i className={`iconfont ${checked ? 'm-active' : ''}`}>&#xe688;</i>
        </a>
      </Dropdown>
    );
  }
}
FilterDropdown.defaultProps = {
  fieldName: '',
  list: [],
  /**
   *  点击菜单
   * @param {*} {item, key, keyPath, domEvent}
   */
  menuClick() {},
};

FilterDropdown.propTypes = {
  fieldName: PropTypes.string,
  list: PropTypes.array,
  menuClick: PropTypes.func,
};

export default FilterDropdown;
