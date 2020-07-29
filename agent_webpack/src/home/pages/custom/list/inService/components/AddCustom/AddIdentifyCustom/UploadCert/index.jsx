// 上传营业执照
import React, { Component } from 'react';
import { Upload, Button, Icon, message, Spin } from 'antd';
import { connect } from 'nuomi';
import axios from 'axios';
import Carousel from '@components/Carousel';
import ShowConfirm from '@components/ShowConfirm';
import services from '../../../../services';
import Style from './style.less';

class UploadCert extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // 是否识别中 false=未在识别; true=识别中
      loading: false,
    };
  }

  // 图片删除
  delImg = () => {
    const { dispatch, scanSubData } = this.props;
    dispatch({
      type: 'updateState',
      payload: {
        scanSubData: {
          ...scanSubData,
          fileUrl: '',
          fileList: [],
        },
      },
    });
  };

  // 识别营业执照
  discernCret = async () => {
    const { dispatch, scanSubData, form } = this.props;
    let { loading } = this.state;
    // form.resetFields();
    const { fileUrl, fileList } = scanSubData;
    if (!fileUrl) {
      message.warn('您还没有上传营业执照，请先上传');
      return false;
    }
    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append('file', file);
    });
    // 识别新增 >上传识别图片
    loading = true;
    this.setState({
      loading,
    });
    axios.post(`${basePath}instead/v2/customer/scan.do`, formData).then((res) => {
      if (res.data.status === 200) {
        const taskId = res.data.data;
        const timer = setInterval(async () => {
          //= =====怎么在失败的时候需要去掉定时器
          try {
            const data = await services.getScanInfo({ taskId });
            const { status } = data; // 图像识别状态 - 2：任务还没有执行 1：识别成功 3正在识别中
            switch (status) {
              case 1: {
                clearInterval(timer);
                loading = false;
                let title = [];
                data.customerName ? '' : (title = [...title, '客户名称']);
                data.unifiedSocialCreditCode ? '' : (title = [...title, '统一社会信用代码']);
                data.representative ? '' : (title = [...title, '法定代表人']);
                data.registeredCapital ? '' : (title = [...title, '注册资本']);
                data.establishmentDate ? '' : (title = [...title, '成立日期']);
                data.registrationAddress ? '' : (title = [...title, '经营场所']);
                data.businessScope ? '' : (title = [...title, '经营范围']);
                if (title.length) {
                  ShowConfirm({
                    title: `未识别到“${title.join('，')}”`,
                    type: 'warning',
                  });
                }
                break;
              }

              case 2:
                loading = true;
                break;
              case 3:
                loading = true;
                break;
              default:
                break;
            }
            dispatch({
              type: 'updateState',
              payload: {
                scanSubData: {
                  ...scanSubData,
                  ...data,
                },
              },
            });
          } catch (err) {
            loading = false;
            message.error(err.message);
            clearInterval(timer);
          }
          this.setState({
            loading,
          });
        }, 1000);
      } else {
        loading = false;
        message.error(res.data.message);
        this.setState({
          loading,
        });
      }
    });
  };

  // 上传前校验
  beforeUpload = async (file) => {
    const { dispatch, scanSubData } = this.props;
    // , 'image/bmp', 'application/pdf'
    const isJPG = ['image/jpeg', 'image/png'].includes(file.type);
    if (!isJPG) {
      message.warn('上传文件格式错误，仅支持图片(jpg，jpeg，png)');
      return false;
    }
    // 图片大小超出限制，提示：图片大小不能超过10M
    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      message.warn('图片大小不能超过10M');
      return false;
    }
    const fileUrl = await this.getBase64(file);
    dispatch({
      type: 'updateState',
      payload: {
        scanSubData: {
          ...scanSubData,
          fileUrl,
          fileList: [file],
        },
      },
    });
    return false;
  };

  // 获取图片的本地路径
  getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  render() {
    const { loading } = this.state;
    const {
      scanSubData: { fileUrl },
    } = this.props;
    const uploadButton = (
      <div>
        <Icon type={loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">
          <p className={Style['color-888']}>上传营业执照</p>
          <div className={Style['color-BFBFBF']}>
            <p>格式：jpg，jpeg，png</p>
            <p>大小：小于10M</p>
          </div>
        </div>
      </div>
    );
    const upProps = {
      accept: 'image/jpeg,image/png',
      name: 'file',
      listType: 'picture-card',
      className: Style['m-upload'],
      showUploadList: false,
      beforeUpload: this.beforeUpload,
    };
    return (
      <Spin spinning={loading}>
        <div className={Style['cert-uploader']}>
          <div className={Style['m-imgArea']}>
            {fileUrl ? (
              <>
                <div className={Style['m-uploadImg']}>
                  <Carousel
                    imageUrl={fileUrl}
                    getContent={({ zoom, curScale }) => (
                      <span className={Style['m-scaleBtn']}>
                        <i className="iconfont" onClick={() => zoom()}>
                          &#xea33;
                        </i>
                        <span>{curScale}%</span>
                        <i className="iconfont" onClick={() => zoom(true)}>
                          &#xea35;
                        </i>
                      </span>
                    )}
                  />
                </div>
                <div className={Style['j-delImg']} onClick={this.delImg}>
                  <i className="iconfont">&#xea70;</i>
                </div>
              </>
            ) : (
              <Upload {...upProps}>{uploadButton}</Upload>
            )}
          </div>

          <div className={Style['m-btnArea']}>
            <Button onClick={this.discernCret} loading={loading}>
              {loading ? '正在识别...' : '识别'}
            </Button>
          </div>
        </div>
      </Spin>
    );
  }
}
export default connect(({ scanSubData }) => ({ scanSubData }))(UploadCert);
