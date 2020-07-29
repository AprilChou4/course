/**
 * 可编辑表格中根据编辑元素的 onBlur 时间来定位编辑 td，antd 默认 datePicker 的 onBlur 无法满足需求
 * 包装 DatePicker 组件，自定义 onBlur 和 focus 方法
 * 1. 实现 onFocus 自动打开弹框
//  * 2. 只在关闭弹窗时触发 onBlur
 * 3. 只用于 EditableTable 的 editRender 中
 */
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { DatePicker } from 'antd';

class TableDatePicker extends React.Component {
  constructor(props) {
    super(props);
    this.dateFormat = props.format || 'YYYY-MM-DD';
    this.state = {
      value: props.value,
    };

    this.rootRef = React.createRef(null);
    this.datePicker = React.createRef(null);

    // 标记 value 是否改变
    this.isChange = false;
  }

  componentDidMount() {
    this.setFocus();

    // 初始化时自动展开下拉列表
    document.querySelector('.date-picker-blq-xxs input').click();
    document.addEventListener('click', this.onBlur, false);
  }

  shouldComponentUpdate(nextProps) {
    const { value } = this.props;
    if (moment(value).format(this.dateFormat) !== moment(nextProps.value).format(this.dateFormat)) {
      return true;
    }
    return false;
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.onBlur, false);
  }

  onCurChange = (v) => {
    const { onChange } = this.props;
    this.isChange = true;

    this.setState({ value: v });

    // 保存value到form
    onChange && onChange(v);

    const { saveAndToNext, save, setActiveTd, disabledNext } = this.props;

    // 日期改变，自动关闭弹窗，并跳转下一单元格
    if (disabledNext) {
      save();
      setActiveTd();
      return;
    }

    saveAndToNext();
  };

  setFocus = () => this.datePicker.current.focus();

  // 添加自定义 focus
  focus = () => {};

  onBlur = () => {
    const { setActiveTd } = this.props;
    // 点击后如果弹窗关闭，且 value 未改变，即为点击空白处
    if (!this.isChange && !this.isOpen) {
      setActiveTd();
    }
  };

  // 弹窗关闭 先于 onChange 执行
  onOpenChange = (isOpen) => {
    this.isOpen = isOpen;
  };

  render() {
    const { disabledDate, format } = this.props;
    const { value } = this.state;
    const { MonthPicker } = DatePicker;
    const Dates = format === 'YYYY-MM' ? MonthPicker : DatePicker;
    const dateProps = {};
    if (disabledDate) dateProps.disabledDate = disabledDate;

    return (
      <div className="date-picker-blq-xxs" ref={this.rootRef}>
        <Dates
          allowClear={false}
          {...dateProps}
          onChange={this.onCurChange}
          onOpenChange={this.onOpenChange}
          ref={this.datePicker}
          value={value}
        />
      </div>
    );
  }
}

TableDatePicker.defaultProps = {
  disabledNext: false,
};

TableDatePicker.propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.any,
  disabledNext: PropTypes.bool, // 是否禁止点击后自动跳转下一单元格
};

export default TableDatePicker;
