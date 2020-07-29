// 系统消息> 建议反馈 > 图片预览
// 系统消息> 建议反馈 > 上传图片
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'nuomi';
import { Upload, Icon, Modal, message } from 'antd';
import Style from '../style.less';

class ViewImg extends PureComponent {
  state = {
    previewVisible: false,
    previewImage: '',
  };

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async (file) => {
    // if (!file.url && !file.preview) {
    //   file.preview = await getBase64(file.originFileObj);
    // }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };

  render() {
    const { previewVisible, previewImage } = this.state;
    return (
      <Modal
        visible={previewVisible}
        footer={null}
        width={600}
        height={480}
        onCancel={this.handleCancel}
      >
        <img alt="预览图片" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    );
  }
}
export default connect()(ViewImg);
