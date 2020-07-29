// 系统消息> 建议反馈 > 上传图片
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'nuomi';
import PropTypes from 'prop-types';
import { Upload, Icon, Modal, message } from 'antd';
import Style from './style.less';

class UploadImg extends PureComponent {
  state = {
    previewVisible: false,
    previewImage: 'http://192.168.210.110/group1/M00/14/8A/wKjScF1LgoGAaey4AABCmF9dwWc7485884',
    fileList: [],
  };

  // 上传前校验
  beforeUpload = (file) => {
    const isJPG = ['image/jpeg', 'image/png', 'image/bmp', 'image/gif'].includes(file.type);
    if (!isJPG) {
      message.warn('上传文件格式错误，仅支持图片(jpg、png、bmp、gif)');
    }

    // 图片大小超出限制，提示：图片大小不能超过10M
    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      message.warn('图片大小不能超过10M');
    }
    return isJPG && isLt10M;
  };

  handleChange = ({ fileList }) => this.setState({ fileList });

  delImg = () => {
    this.setState({
      fileList: [],
    });
  };

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async (file) => {
    // if (!file.url && !file.preview) {
    //   file.preview = await getBase64(file.originFileObj);
    // }

    this.setState({
      // previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };

  render() {
    const { previewVisible, previewImage } = this.state;
    const { fileList, onChange, isDelete, onDeleteImg, ...rest } = this.props;
    return (
      <Fragment>
        {fileList.length >= 1 ? (
          fileList.map((item, index) => (
            <div className={Style['m-upImg']} key={index}>
              <img src={item} alt="图片" />
              {isDelete && (
                <i className={`iconfont ${Style['j-del']}`} onClick={() => onDeleteImg()}>
                  &#xeb2f;
                </i>
              )}
              <i className={`iconfont ${Style['j-view']}`} onClick={() => this.handlePreview()}>
                &#xea35;
              </i>
            </div>
          ))
        ) : (
          <Upload
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            listType="picture-card"
            fileList={fileList}
            // onPreview={this.handlePreview}
            onChange={onChange}
            beforeUpload={this.beforeUpload}
            showUploadList={false}
            className={Style['m-upBtn']}
          >
            <Icon type="plus" />
          </Upload>
        )}
        <Modal
          className={Style['m-viewImg']}
          visible={previewVisible}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{ width: '100%' }} src={fileList[0]} />
        </Modal>
      </Fragment>
    );
  }
}
UploadImg.defaultProps = {
  // 图片上传
  onChange() {},
  fileList: [],
  // 是否可删除
  isDelete: false,
  // 删除图片
  onDeleteImg() {},
};
UploadImg.propTypes = {
  onChange: PropTypes.func,
  fileList: PropTypes.array,
  isDelete: PropTypes.bool,
  onDeleteImg: PropTypes.func,
};
export default connect()(UploadImg);
