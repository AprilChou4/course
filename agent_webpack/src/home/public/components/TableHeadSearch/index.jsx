// table th的搜索
import React, { Component } from 'react';
import { Popover, Input, Icon } from 'antd';
import PropTypes from 'prop-types';
import './style.less';

class TableHeadSearch extends Component {
  state = {
    visible: false,
    value: '',
  };

  componentWillReceiveProps(nextProps) {
    const { field } = this.props;
    this.setState({
      value: nextProps[field],
    });
  }

  handleClick = () => {
    const { visible } = this.state;
    this.setState({ visible });
  };

  popVisibleChange = (visible) => {
    this.setState({ visible });
  };

  handleSearch = (e) => {
    // const { setData, fetch } = this.props;
    const { field, onSearch } = this.props;
    const { value } = e.target;
    this.setState({
      visible: false,
    });
    // const data = {
    //   [field]: value,
    //   chiefAccountId: '',
    //   drawerIds: '',
    // };
    onSearch({
      [field]: value,
    });
  };

  handleChange = (e) => {
    const { value } = e.target;
    this.setState({
      value,
    });
  };

  render() {
    const { fieldName } = this.props;
    const { visible, value } = this.state;
    const content = (
      <Input
        // value={value}
        autoFocus
        autoComplete="off"
        placeholder="请输入需要查询的内容"
        onPressEnter={this.handleSearch}
        onChange={this.handleChange}
      />
    );
    return (
      <Popover
        trigger="click"
        placement="bottom"
        arrowPointAtCenter
        content={content}
        visible={visible}
        onVisibleChange={this.popVisibleChange}
        overlayClassName="ui-header-search"
        className="ui-header-searchTitle"
      >
        <a onClick={this.handleClick}>
          <span>{fieldName}</span>
          <Icon className="e-ml5" type="search" />
        </a>
      </Popover>
    );
  }
}
TableHeadSearch.defaultProps = {
  // head名称
  fieldName: '',
  // 对应字段名
  field: '',
  /**
   *选择下拉选项时回调
   * @param {*} value
   * @param {*} option
   */
  onSearch() {},
  // 回车时回调
  //   onPressEnter(e) {},
};
TableHeadSearch.propTypes = {
  fieldName: PropTypes.string,
  field: PropTypes.string,
  // searchList: PropTypes.array,
  onSearch: PropTypes.func,
};
export default TableHeadSearch;
