/**
 * 简洁版，不带点我上传按钮
 */
import util from 'util';
import { Icon } from 'antd';
import React from 'react';
import PropTypes from 'prop-types';
import Upload from './index';
import './style/index';

class CommonUpload extends React.Component {
  constructor(props) {
    super(props);
    this.uploadRef = React.createRef();
  }

  onDownload = () => {
    const { url, params } = this.props.download;
    util.submit(url, params || {}, '_blank');
  };

  upload = () => {
    this.uploadRef.current.upload();
  };

  render() {
    const {
      uploadProps,
      download,
      topText,
      noTopText,
      fileName,
      onDeleteFile,
      description,
    } = this.props;
    return (
      <div className="common-upload-ie9-s">
        {!noTopText && (
          <div className="top-text">
            {topText || '为确保导入数据的准确性，请根据模板格式导入哦！'}
            <a href="javascript:;" onClick={this.onDownload}>
              {`${download.name || '下载模板'}.xls`}
            </a>
          </div>
        )}
        <Upload {...uploadProps} ref={this.uploadRef}>
          <div className="upload-wrap">
            {fileName ? (
              <div className="file-info">
                <span className="excel" />
                {fileName}
                <a
                  href="javascript:;"
                  onClick={(e) => {
                    e.stopPropagation();
                    this.uploadRef.current.clearInput();
                    onDeleteFile();
                  }}
                >
                  <Icon className="close" type="close" />
                </a>
              </div>
            ) : (
              <>
                <div className="add">
                  <Icon type="plus-circle" /> 点击添加文件
                </div>
                <p className="info">
                  {description ||
                    `支持扩展名：${uploadProps.accept ||
                      '.xls、.xlsx'}格式文件`}
                </p>
              </>
            )}
          </div>
        </Upload>
      </div>
    );
  }
}

CommonUpload.propTypes = {
  uploadProps: PropTypes.objectOf(PropTypes.any), // 上传相关参数
  download: PropTypes.objectOf(PropTypes.any), // 下载相关参数 { url, params: {}, name}
  topText: PropTypes.any, // 顶部提示文本
  noTopText: PropTypes.bool, // 不显示顶部文本和下载模板
  fileName: PropTypes.string, // 选中的文件名
  onDeleteFile: PropTypes.func, // 删除选中的文件
  bottomText: PropTypes.any, // 底部文本
};

export default CommonUpload;
