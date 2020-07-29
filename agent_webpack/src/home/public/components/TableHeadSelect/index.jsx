// table th带下拉的搜索
import React, { Component } from 'react';
import { Popover, AutoComplete, Input, Icon } from 'antd';
import PropTypes from 'prop-types';
import './style.less';

const { Option } = AutoComplete;
class TableHeadSelect extends Component {
  state = {
    // 弹层显示隐藏
    visible: false,
    value: '',
  };

  componentWillReceiveProps(nextProps) {
    const { field } = this.props;
    this.setState({
      value: nextProps[field],
    });
  }

  popVisibleChange = (visible) => {
    this.setState({ visible });
  };

  handleSelect = (value, option) => {
    const { onSelect } = this.props;
    this.setState({
      visible: false,
    });
    onSelect(value, option);
    // const { setData, fetch } = this.props;
    // const { field } = this.props.data;
    // const { searchList } = this.state;
    // this.setState({
    // visible: false;
    //   value,
    //   searchList: searchList.filter((item) => item.userId == value),
    // });
    // setData({
    //   [field]: option ? option.props.children : value,
    //   [field == 'chiefAccountId' ? 'drawerIds' : 'chiefAccountId']: '',
    //   officer: '',
    // });
    // fetch({
    //   [field]: value,
    //   [field == 'chiefAccountId' ? 'drawerIds' : 'chiefAccountId']: '',
    //   officer: '',
    // });
  };

  handleChange = (value) => {
    this.setState({
      value,
    });
  };

  handlePressEnter = (e) => {
    const { value } = e.target;
    if (!value) {
      this.handleSelect(value);
    }
  };

  render() {
    const { field, fieldName, searchList, onSelect } = this.props;
    const { visible, value } = this.state;
    const content = (
      <AutoComplete
        // value={value}
        autoFocus
        autoComplete="off"
        placeholder="请输入需要查询的内容"
        defaultActiveFirstOption={false}
        onDropdownVisibleChange={this.onDropdownVisibleChange}
        onSelect={this.handleSelect}
        onChange={this.handleChange}
        filterOption={(inputValue, option) =>
          option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
        }
        dataSource={searchList.map((item, index) => (
          <Option key={index} value={item.staffId}>
            {item.realName}
          </Option>
        ))}
      >
        <Input onPressEnter={this.handlePressEnter} autoComplete="off" />
      </AutoComplete>
    );
    return (
      <Popover
        trigger="click"
        placement="bottom"
        arrowPointAtCenter
        content={content}
        visible={visible}
        onVisibleChange={this.popVisibleChange}
        overlayClassName="ui-header-select"
        className="ui-header-selectTitle"
      >
        <a>
          <span>{fieldName}</span>
          <Icon type="search" />
        </a>
      </Popover>
    );
  }
}
TableHeadSelect.defaultProps = {
  // head名称
  fieldName: '',
  // 对应字段名
  field: '',
  // 下拉数据
  searchList: [],
  /**
   *选择下拉选项时回调
   * @param {*} value
   * @param {*} option
   */
  onSelect() {},
  // 回车时回调
  //   onPressEnter(e) {},
};
TableHeadSelect.propTypes = {
  fieldName: PropTypes.string,
  field: PropTypes.string,
  searchList: PropTypes.array,
  onSelect: PropTypes.func,
};
export default TableHeadSelect;
