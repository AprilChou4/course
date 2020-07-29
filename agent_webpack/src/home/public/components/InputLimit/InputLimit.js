import React, { PureComponent, Fragment } from 'react';
import { Input } from 'antd';
import classNames from 'classnames';
import './index.less';

class InputLimit extends PureComponent {
  constructor(props) {
    super(props);
    const { defaultValue } = props;
    this.useDefaultValue = defaultValue !== undefined;
    this.state = { defaultValue };
  }

  state = {
    innerValue: undefined, // 输入框内容
  };

  // -------------------------------------------------------------------------------------------------------------- 动态UI相关

  getInput = ({
    value,
    suffix,
    maxLength,
    allowClear,
    preventInput,
    onChange,
    onLimit,
    style,
    className,
    ...rest
  }) => {
    const { useDefaultValue } = this;
    const { innerValue, defaultValue } = this.state;
    const valueProp = {};
    if (useDefaultValue) {
      valueProp.defaultValue = defaultValue;
    } else {
      valueProp.value = value === undefined ? innerValue : value;
    }
    if (maxLength && preventInput === true) {
      valueProp.maxLength = maxLength;
    }
    return (
      <Input
        className={classNames('ui-inputLimit', className)}
        {...valueProp}
        suffix={this.getSuffix(
          maxLength,
          valueProp.defaultValue ? valueProp.defaultValue : valueProp.value,
          suffix,
        )}
        allowClear={allowClear}
        onChange={(e) => this.handleChange(e, maxLength, preventInput, value, onChange, onLimit)}
        style={style}
        {...rest}
      />
    );
  };

  getLength = (num) => {
    let length = 0;
    let maxLengthTmp = num;
    while (maxLengthTmp >= 1) {
      maxLengthTmp /= 10;
      length += 1;
    }
    if (length <= 0) length = 1;
    return length;
  };

  getSuffix = (maxLength, value, suffix) => {
    return (
      <Fragment>
        <span
          style={{
            // color: maxLength <= (value || '').length ? 'red' : '#bbb',
            marginRight: suffix ? 5 : undefined,
            color: '#BFBFBF',
            fontSize: '13px',
          }}
        >
          {(value || '').length}/{maxLength}
        </span>
        {suffix || null}
      </Fragment>
    );
  };

  // -------------------------------------------------------------------------------------------------------------- 事件处理

  handleChange = (e, maxLength, preventInput, value, onChange, onLimit) => {
    this.useDefaultValue = false;
    if (value === undefined && (!preventInput || (e.target.value || '').length <= maxLength)) {
      this.setState({ innerValue: e.target.value });
    }
    if (onChange instanceof Function) onChange(e);
    if (onLimit instanceof Function && (e.target.value || '').length > maxLength)
      onLimit(e.target.value, maxLength, e);
  };

  render() {
    const {
      defaultValue, // 输入框默认内容
      value, // 输入框内容
      suffix, // input的后缀图标 ReactNode
      maxLength, // 输入框输入最大长度
      preventInput = true, // 输入框输入操过最大长度是否阻止输入
      allowClear = false, // 可以点击清除图标删除内容 boolean
      onChange, // 输入框内容变化时的回调 (e) => ()
      onLimit, // 输入超限 (value, e) => ()
      style = {}, // Input控件style
      className,
      ...rest
    } = this.props;
    return (
      <Fragment>
        {this.getInput({
          defaultValue,
          value,
          suffix,
          maxLength,
          preventInput,
          allowClear,
          onChange,
          onLimit,
          style,
          className,
          ...rest,
        })}
      </Fragment>
    );
  }
}

export default InputLimit;
