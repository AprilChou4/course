import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Spin } from 'antd';
import ColTable from './ColTable';
import './style.less';

class CustomCol extends Component {
  constructor(props) {
    super(props);
    this.columnSource = props.columnSource;
  }

  // 保存自定义列数据
  saveData = (obj) => {
    this.columnSource = obj;
  };

  onOk = () => {
    const { setColOption } = this.props;
    setColOption(this.columnSource);
  };

  render() {
    const { setColOption, columnSource, isLoading, ...rest } = this.props;
    return (
      <Modal
        title="显示列设置"
        width={518}
        maskClosable={false}
        centered
        onOk={this.onOk}
        className="ui-customCol"
        // onCancel={onCancel}
        // visible={visible}
        {...rest}
      >
        <Spin spinning={isLoading}>
          <p className="custom-col-note">注：鼠标拖动行，可调整顺序</p>
          <ColTable saveColumnSource={this.saveData} columnData={columnSource} />
        </Spin>
      </Modal>
    );
  }
}
CustomCol.defaultProps = {
  setColOption() {},
  // 自定义列
  columnSource: [],
  // 加载
  isLoading: false,
};
CustomCol.propTypes = {
  /**
   * @func 获取输入框展示数据，用于在输入框中展示前的处理
   * @param data {array} 自定义列表
   */
  setColOption: PropTypes.func,
  // 自定义列
  columnSource: PropTypes.array,
  // 加载
  isLoading: PropTypes.bool,
};
export default CustomCol;
