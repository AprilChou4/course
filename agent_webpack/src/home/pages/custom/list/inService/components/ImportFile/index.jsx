// 带输入框按钮的上传
import React, { Component } from 'react';
import { Upload, Input, Button } from 'antd';
import PropTypes from 'prop-types';
import './style.less';

class ImportFile extends Component {
  // input框删除
  changeInput = () => {
    const {
      setData,
      form: { resetFields },
      id,
    } = this.props;
    resetFields && resetFields(id, '');

    setData({
      fileList: [],
      fileName: '',
    });
  };

  render() {
    const { form, fileList, id, fileName, className, setData, ...rest } = this.props;
    const props = {
      beforeUpload: (file) => {
        setData({
          fileList: [file],
          fileName: file.name,
        });
        return false;
      },
      showUploadList: false,
      fileList,
      className: 'f-fl',
    };
    return (
      <div className={`ui-importFile f-clearfix ${className || ''}`} {...rest}>
        <Input
          placeholder="请选择文件"
          readOnly
          className="f-fl m-input"
          allowClear
          onChange={this.changeInput}
          value={fileName}
        />
        <Upload {...props}>
          <Button type="primary" ghost className="f-fl">
            选择文件
          </Button>
        </Upload>
      </div>
    );
  }
}
ImportFile.defaultProps = {
  // 上传文件
  fileList: [],
  // 输入框内容
  fileName: '',
  // 改变父组件state
  setData() {},
  form: {},
};
ImportFile.propTypes = {
  fileList: PropTypes.array,
  fileName: PropTypes.string,
  setData: PropTypes.func,
  form: PropTypes.object,
};
export default ImportFile;
