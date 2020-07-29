import React, { Component } from 'react';
import { Icon, Input } from 'antd';
import PropTypes from 'prop-types';

export default class Search extends Component {
  handleChange = (e) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(e);
    }
  };

  handleClear = (e) => {
    e.preventDefault();
    const { handleClear } = this.props;
    if (handleClear) {
      handleClear(e);
    }
  };

  render() {
    const { placeholder, value, prefixCls } = this.props;
    const icon =
      value && value.length > 0 ? (
        <a href="" className={`${prefixCls}-action`} onClick={this.handleClear}>
          <Icon type="cross-circle" />
        </a>
      ) : (
        <span className={`${prefixCls}-action`}>
          <Icon type="search" />
        </span>
      );

    return (
      <div className={`${prefixCls}-wapper`}>
        <Input
          placeholder={placeholder}
          className={prefixCls}
          value={value}
          onChange={this.handleChange}
          allowClear={false}
        />
        {icon}
      </div>
    );
  }
}

Search.defaultProps = {
  placeholder: '',
};

Search.propTypes = {
  onChange: PropTypes.func.isRequired,
  handleClear: PropTypes.func.isRequired,
  prefixCls: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.any.isRequired,
};
