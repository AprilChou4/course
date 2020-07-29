import React, { PureComponent, Fragment } from 'react';
import { Input } from 'antd';

class TextAreaLimit extends PureComponent {
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
    maxLength,
    preventInput,
    autosize,
    onChange,
    onLimit,
    wrapClassName,
    wrapStyle,
    className,
    style,
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
      <span className={wrapClassName || undefined} style={{ whiteSpace: 'nowrap', ...wrapStyle }}>
        <Input.TextArea
          className={className || undefined}
          {...valueProp}
          autoSize={autosize}
          onChange={(e) => this.handleChange(e, maxLength, preventInput, value, onChange, onLimit)}
          style={style}
          {...rest}
        />
        {this.getSuffix(
          maxLength,
          valueProp.defaultValue ? valueProp.defaultValue : valueProp.value,
        )}
      </span>
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

  getSuffix = (maxLength, value) => {
    const length = this.getLength(maxLength) + this.getLength((value || '').length);
    return (
      <>
        <span
          style={{
            position: 'relative',
            left: -1 * (length * 8.6),
            bottom: -26,
            color: '#BFBFBF',
            fontSize: '13px',
            // color: maxLength <= (value || '').length ? 'red' : '#bbb',
          }}
        >
          {(value || '').length}/{maxLength}
        </span>
      </>
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
      maxLength, // 输入框输入最大长度
      preventInput = true, // 输入框输入操过最大长度是否阻止输入
      autosize = false, // 自适应内容高度，可设置为 true|false 或对象：{ minRows: 2, maxRows: 6 }
      onChange, // 输入框内容变化时的回调 (e) => ()
      onLimit, // 输入超限 (value, e) => ()
      wrapClassName, // 最外层包装元素的className
      wrapStyle = {}, // 最外层包装元素的className
      className, // Input.TextArea控件className
      style = {}, // Input.TextArea控件style
      ...rest
    } = this.props;
    return (
      <>
        {this.getInput({
          defaultValue,
          value,
          maxLength,
          preventInput,
          autosize,
          onChange,
          onLimit,
          wrapClassName,
          wrapStyle,
          className,
          style,
          ...rest,
        })}
      </>
    );
  }
}

export default TextAreaLimit;
