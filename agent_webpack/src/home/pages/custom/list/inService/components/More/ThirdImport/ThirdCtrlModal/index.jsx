// 第三方导入+Ctrl
import React, { Component } from 'react';
import { Modal, Upload, Input, message, Form, Button } from 'antd';
import { connect } from 'nuomi';
import { request } from 'nuijs';
import { progressModal } from '@components/HintModal';
import Style from './style.less';

@Form.create()
class ThirdModal extends Component {
  state = {
    fileList: [], // 文件列表
    fileName: '', // 文件名称
    failVisible: false, // 导入结果弹出层
  };

  // 确定
  onOk = () => {
    const { dispatch } = this.props;
    const { fileList, fileName } = this.state;
    if (!fileName) {
      message.warning('请选择导入文件');
      return false;
    }
    if (!/\.txt$/.test(fileName)) {
      message.warning('请选择正确的导入文件');
      return false;
    }
    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append('file', file);
    });
    this.onCancel();
    progressModal('正在批量授权', '当前授权进度为', (modal) => {
      request({
        url: '/jz/bill/batchValidateAuthCode.do',
        method: 'post',
        processData: false,
        data: formData,
        contentType: 'multipart/form-data',
        success: (res) => {
          if (res.status === 200) {
            this.setState({
              fileList: [],
            });
            message.success('批量授权成功');
          } else {
            this.setState({
              failVisible: true,
            });
            // this.showModal();
          }
          modal.hide();
        },
        error: () => {
          message.error('upload failed.');
          modal.hide();
          this.showModal();
        },
      });
    });
  };

  // 取消
  onCancel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'updateState',
      payload: {
        thirdCtrlVisible: false,
      },
    });
  };

  // 显示导入 授权码弹窗
  showModal = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'updateState',
      payload: {
        thirdCtrlVisible: true,
      },
    });
  };

  // input框删除
  changeInput = () => {
    this.setState({
      fileList: [],
      fileName: '',
    });
  };

  // 关闭导入结果弹窗
  closeFail = () => {
    this.setState({
      failVisible: false,
    });
  };

  render() {
    const { thirdCtrlVisible } = this.props;
    const { fileList, fileName } = this.state;
    const props = {
      beforeUpload: (file) => {
        this.setState((state) => ({
          fileList: [...state.fileList, file],
          fileName: file.name,
        }));
        return false;
      },
      showUploadList: false,
      fileList,
      className: 'f-fl',
    };
    return (
      <>
        {thirdCtrlVisible && (
          <Modal
            title="选择登录软件"
            visible={thirdCtrlVisible}
            width={460}
            className={Style['m-importCode']}
            onOk={this.onOk}
            onCancel={this.onCancel}
            destroyOnClose
            maskClosable={false}
            centered
          >
            <div className={Style['m-hint']}>
              <i className="iconfont">&#xeaa1;</i>
              温馨提示：需要转换目前支持的软件，请先联系管理人员
            </div>
            <div className={`f-clearfix ${Style['m-upBox']}`}>
              <Input
                placeholder="请选择文件"
                readOnly
                className={`f-fl ${Style['m-input']}`}
                allowClear
                onChange={this.changeInput}
                value={fileName}
              />

              <Upload {...props}>
                <Button type="primary" ghost className={`f-fl ${Style['m-fileBtn']}`}>
                  选择文件
                </Button>
              </Upload>
            </div>
          </Modal>
        )}
      </>
    );
  }
}
export default connect(({ thirdCtrlVisible }) => ({
  thirdCtrlVisible,
}))(ThirdModal);
