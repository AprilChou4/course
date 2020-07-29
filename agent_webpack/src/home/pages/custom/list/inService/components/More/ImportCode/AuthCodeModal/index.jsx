// 导入授权码弹窗
import React, { Component } from 'react';
import { Modal, Upload, Input, message, Form, Button } from 'antd';
import { connect } from 'nuomi';
import axios from 'axios';
import { progressModal } from '@components/HintModal';
import FailModal from '../FailModal';
import Style from './style.less';

@Form.create()
class AuthCodeModal extends Component {
  state = {
    fileList: [], // 文件列表
    fileName: '', // 文件名称
    failVisible: false, // 导入结果弹出层
    failData: {}, // 导入失败数据
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
      axios
        .post(`${basePath}jz/bill/batchValidateAuthCode.do`, formData)
        .then(({ data }) => {
          if (data.status === 200) {
            const { path, result, successCount, total } = data.data;
            if (result) {
              this.setState({
                fileList: [],
                fileName: '',
              });
              message.success('批量授权成功');
            } else {
              this.setState({
                failVisible: true,
                failData: data.data,
                fileList: [],
                fileName: '',
              });
            }
          } else {
            message.error(data.message);
          }
          modal.hide();
        })
        .catch((err) => {
          message.error(err.message);
          modal.hide();
          this.showModal();
        });
    });
  };

  // 取消
  onCancel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'updateState',
      payload: {
        authCodeVisible: false,
      },
    });
    this.setState({
      fileList: [],
      fileName: '',
    });
  };

  // 显示导入 授权码弹窗
  showModal = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'updateState',
      payload: {
        authCodeVisible: true,
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
    const { authCodeVisible } = this.props;
    const { fileList, fileName, failVisible, failData } = this.state;
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
        {authCodeVisible && (
          <Modal
            title="导入授权码"
            visible={authCodeVisible}
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
              请选择进销项发票提取工具中“导出授权码”的【导出文件】
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
        <FailModal visible={failVisible} closeFail={this.closeFail} failData={failData} />
      </>
    );
  }
}
export default connect(({ authCodeVisible }) => ({
  authCodeVisible,
}))(AuthCodeModal);
