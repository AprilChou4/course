import React, { Component } from 'react';
import { Input } from 'antd';
import PropTypes from 'prop-types';
import Suffix from './Suffix';
import './style.less';

class SearchInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      value: props.defaultValue,
      searchData: [],
    };
    this.suffix = null;
  }

  componentWillReceiveProps(nextP) {
    const { value } = this.props;
    if (value !== nextP.defaultValue) {
      const arr = [];
      nextP.defaultValue &&
        nextP.defaultValue.split(';').forEach((item) => {
          const [title, text] = (item && item.split(':')) || [];
          arr.push({
            title,
            text,
          });
        });
      this.setState({
        value: nextP.defaultValue,
        searchData: arr,
      });
    }
  }

  _visibleChange = (visible, form) => {
    const { moreChange } = this.props;
    this.setState({
      visible,
    });
    // form用于别的页面跳转过来，重置表单，不然无法选中的还是原来的
    moreChange(visible, form);
  };

  search = (formValues) => {
    let { value, searchData } = this.state;
    const { name } = this.props;
    let data = {};
    // 清空时
    if (formValues === null) {
      value = '';
      searchData = [];
    }
    // 查询时
    else if (formValues) {
      data = formValues;
      searchData = this.props.getSearchData(data) || [];

      value = this.props.getValue(searchData, data) || '';
    }
    // 搜索时
    else if (searchData.length) {
      data = this.suffix._getFieldsValue();
    }
    // 搜索时
    else {
      data[name] = value = value ? value.trim() : '';
    }
    this.setState(
      {
        value,
        searchData,
        visible: false,
      },
      () => {
        this.props.onSearch(data, searchData);
      },
    );
  };

  _change = (e) => {
    // 清除
    if (e.type === 'click') {
      this.search(null);
      if (this.suffix) {
        this.suffix._reset();
        this.suffix._restoreDefault();
      }
    } else {
      this.setState({
        value: e.target.value,
      });
    }
  };

  _keyDown = (e) => {
    if (e.keyCode === 13) {
      this.search();
    }
  };

  _getSuffix = (suffix) => {
    this.suffix = suffix;
  };

  render() {
    const {
      children,
      onSearch,
      trigger,
      getContent,
      getValue,
      getSearchData,
      moreChange,
      className,
      ...rest
    } = this.props;
    const { visible, value, searchData } = this.state;
    const hasSearchData = !!searchData.length;
    return (
      <span className={`ui-ant-search-input${className ? ` ${className}` : ''}`}>
        <Input
          allowClear
          {...rest}
          title={hasSearchData ? value : ''}
          readOnly={hasSearchData}
          value={value}
          onChange={this._change}
          onKeyDown={this._keyDown}
          suffix={
            <Suffix
              getSuffix={this._getSuffix}
              getContent={getContent}
              visible={visible}
              trigger={trigger}
              search={this.search}
              visibleChange={this._visibleChange}
            />
          }
        />
      </span>
    );
  }
}

SearchInput.defaultProps = {
  /**
   * @func 搜索时回调
   * @param data {Object} 表单数据
   * @param searchData {Array} getSearchData方法返回的数据列表
   * @return {Null}
   */
  onSearch() {},
  /**
     * @func 获取输入框展示数据，用于在输入框中展示前的处理
     * @param data {Object} 表单数据
     * @return {Array} 
     * 返回值格式为（text字段可以为String或者Array）：
     * [
     *      "内容",
            {
                "title": "标题1",
                "text": "内容"
            },
            {
                "title": "标题2",
                "text": [
                    "内容1",
                    "内容2"
                ]
            }
        ]
     */
  getSearchData() {},
  /**
   * @func 获取输入框展示数据
   * @param searchData {Array} getSearchData方法返回的数据列表
   * @param data {Object} 表单数据
   * @return {String}
   */
  getValue(searchData, data) {
    const values = [];
    searchData.forEach((ele) => {
      if (typeof ele === 'object') {
        const text = Array.isArray(ele.text) ? ele.text.join('、') : ele.text;
        if (text) {
          values.push(`${ele.title}：${text}`);
        }
      } else if (ele !== undefined) {
        values.push(ele);
      }
    });
    return values.join('；');
  },
  /**
   * @func 获取更多功能内容
   * @return {React Node}
   */
  getContent() {},
  // 更多条件展开
  moreChange() {},
};

SearchInput.propTypes = {
  getSearchData: PropTypes.func,
  getContent: PropTypes.func,
  getValue: PropTypes.func,
  visible: PropTypes.bool,
  onSearch: PropTypes.func,
  moreChange: PropTypes.func,
  value: PropTypes.string,
};

export default SearchInput;
