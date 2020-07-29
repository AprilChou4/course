/**
 * 新版，包含点我上传按钮和上传☁️图标
 */
import util from 'util';
import { Icon, Button } from 'antd';
import React from 'react';
import PropTypes from 'prop-types';
import Upload from './index';
import './style/index';

class CommonUpload2 extends React.Component {
  constructor(props) {
    super(props);
    this.uploadRef = React.createRef();

    this.state = {
      error: null,
    };
  }

  onDownload = (e) => {
    e.stopPropagation();
    e.preventDefault();
    const {
      download: { url, params },
    } = this.props;

    util.submit(url, params || {}, '_blank');
  };

  upload = () => {
    this.uploadRef.current.upload();
  };

  onEnd = (res, error) => {
    const { uploadProps } = this.props;
    if (error) this.setState({ error });
    uploadProps.onEnd && uploadProps.onEnd(res, error);
  };

  reUpload = () => {
    this.props.onDeleteFile();
    this.setState({ error: null });
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
      errorMsg,
    } = this.props;

    const { error } = this.state;

    const upProps = { ...uploadProps, onEnd: this.onEnd };

    const showFile = !error && fileName;

    return (
      <div className="common-upload-ie9-s">
        {!noTopText && (
          <div className="top-text">
            {topText || '为确保导入数据的准确性，请根据模板格式导入哦！'}
          </div>
        )}

        <ul className="template2">
          <div className={`file-info ${showFile ? 'show' : 'hide'}`}>
            <span className="excel" />
            {fileName}
            <a
              href="javascript:;"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteFile();
              }}
            >
              <Icon className="close" type="close" />
            </a>
          </div>
          <div className={`wait-upload ${showFile ? 'hide' : 'show'}`}>
            <li className="item icon">
              {error ? (
                <span className="error-text">
                  <Icon type="exclamation-circle" theme="filled" className="error-icon" />
                  {errorMsg || error.message || '文件不可用，请检查后重新上传'}
                </span>
              ) : (
                <i className="iconfont" />
              )}
            </li>
            <li className="item file-box">
              <Upload {...upProps} ref={this.uploadRef}>
                {error ? (
                  <Button type="primary" onClick={this.reUpload} ghost className="btn">
                    重新上传
                  </Button>
                ) : (
                  <Button type="primary" className="btn">
                    点我上传
                  </Button>
                )}
              </Upload>
            </li>
            <li className="item">
              <p className="desc">
                {description || `支持扩展名：${uploadProps.accept || '.xls、.xlsx'}格式文件`}
              </p>
              {download && download.url ? (
                <p className="desc pt8">
                  或使用
                  <a href="javascript:;" className="a-link" onClick={this.onDownload}>
                    {`${download.name || '下载模板'}.xls`}
                  </a>
                </p>
              ) : (
                ''
              )}
            </li>
          </div>
        </ul>
      </div>
    );
  }
}

CommonUpload2.propTypes = {
  uploadProps: PropTypes.objectOf(PropTypes.any).isRequired, // 上传相关参数
  download: PropTypes.objectOf(PropTypes.any), // 下载相关参数 { url, params: {}, name}
  topText: PropTypes.any, // 顶部提示文本
  noTopText: PropTypes.bool, // 不显示顶部文本和下载模板
  onDeleteFile: PropTypes.func, // 删除选中的文件触发回调
  description: PropTypes.any, // 底部格式说明文本
  errorMsg: PropTypes.string, // 重新上传按钮顶部提示语
};

export default CommonUpload2;
