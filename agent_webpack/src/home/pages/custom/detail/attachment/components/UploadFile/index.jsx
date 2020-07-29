// 客户编辑>附件上传组件
// import request from 'request';
import React, { Component, Fragment } from 'react';
import { Input, Button, Progress, Upload, Icon, Popover, List, Card, Avatar, message } from 'antd';
import { connect, router } from 'nuomi';
import { util } from 'nuijs';
import axios from 'axios';
import Animate from 'rc-animate';
import ShowConfirm from '@components/ShowConfirm';
import Style from './style.less';

class UploadFile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileArr: props.fileList,
      editFileItem: false,
    };
  }

  componentWillReceiveProps(nextP) {
    this.setState({
      fileArr: nextP.fileList,
    });
  }

  // 删除
  del = (item, index) => {
    const { dispatch } = this.props;
    ShowConfirm({
      title: '你确定要删除 营业执照.jpg 吗？',
      width: 282,
      onOk: () => {
        dispatch({
          type: '$deleteEnclosure',
          payload: {
            customerEnclosureId: item.customerEnclosureId,
          },
        });
      },
    });
  };

  // 编辑
  edit = (editFileItem) => {
    this.setState({
      editFileItem,
    });
  };

  // 修改文件名
  save = (e) => {
    const { dispatch } = this.props;
    const { editFileItem } = this.state;
    const enclosureName = e.target.value;
    dispatch({
      type: '$updateEnclosure',
      payload: {
        enclosureName,
        customerEnclosureId: editFileItem.customerEnclosureId,
      },
    });
    this.setState({
      editFileItem: {},
    });
  };

  // 文件预览弹窗
  viewFile = (item) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'updateState',
      payload: {
        previewFileVisible: true,
        upType: item.enclosureClass,
        editFileItem: item,
      },
    });
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

  // 下载附件
  downFile = ({ customerId, enclosureName, enclosurePath }) => {
    util.location(
      `${basePath}instead/v2/customer/enclosure/downloadFile.do?enclosurePath=${enclosurePath}&customerId=${customerId}&enclosureName=${enclosureName}`,
    );
  };

  render() {
    const that = this;
    const {
      query: { customerId },
    } = router.location();
    let flag = true; // 图片格式错误多个弹窗控制
    const { fileArr, editFileItem } = this.state;
    const { dispatch, upType } = this.props;
    // upload参数设置
    const uploadProps = {
      action: `${basePath}instead/v2/customer/enclosure/add.do`,
      multiple: true,
      data: {
        customerId,
        enclosureClass: upType,
      },
      name: 'file',
      headers: {
        Authorization: '$prefix $token',
      },
      showUploadList: false,
      beforeUpload(file, fileList) {
        const isFileLen = fileList.length <= 10;
        if (!isFileLen) {
          message.warn('上传文件数量不能超过10个');
          return false;
        }
        const isJPG = ['image/jpeg', 'image/png', 'image/bmp'].includes(file.type);
        const isWord = file.name.indexOf('docx') > -1 || file.name.indexOf('doc') > -1;
        const isPdf = file.name.indexOf('pdf') > -1;
        if (!isJPG && flag) {
          if (!isWord && !isPdf) {
            ShowConfirm({
              type: 'warning',
              title: '上传文件格式错误',
              content: '支持图片(jpg、png、bmp)、pdf、word格式附件',
            });
            return false;
          }
          flag = false;
        }
        const isLt10M = file.size / 1024 / 1024 < 10;
        if (!isLt10M) {
          message.warn('单个文件大小不能超过10M');
        }
        if (isFileLen && isLt10M) {
          if (isJPG || isWord || isPdf) {
            return true;
          }
          return false;
        }
        return false;
      },
      onStart: async (file) => {
        that.setState({
          fileArr: [
            {
              enclosureName: file.name,
              percent: 0,
              file,
              localPath: await that.getBase64(file),
            },
            ...fileArr,
          ],
        });
      },
      onSuccess(res, file) {
        setTimeout(() => {
          message.success('附件上传成功');
          dispatch({
            type: '$getEnclosureList',
          }).then();
        }, 50);
      },
      onError: (err, file) => {
        message.error('上传失败');
        dispatch({
          type: '$getEnclosureList',
        });
      },
      onProgress: async ({ percent }, file) => {
        that.setState({
          fileArr: [
            {
              enclosureName: file.name,
              file,
              percent,
              localPath: await that.getBase64(file),
            },
            ...fileArr,
          ],
        });
      },
      customRequest({
        action,
        data,
        file,
        filename,
        headers,
        onError,
        onProgress,
        onSuccess,
        withCredentials,
      }) {
        // EXAMPLE: post form-data with 'axios'
        const formData = new FormData();
        if (data) {
          Object.keys(data).forEach((key) => {
            formData.append(key, data[key]);
          });
        }
        formData.append(filename, file);
        axios
          .post(action, formData, {
            withCredentials,
            headers,
            onUploadProgress: ({ total, loaded }) => {
              onProgress({ percent: (loaded / total) * 100 || 0 }, file);
            },
          })
          .then(({ data: response }) => {
            onSuccess(response, file);
          })
          .catch((err) => onError(err, file));

        return {
          abort() {
            console.log('upload  is aborted.');
          },
        };
      },
    };
    return (
      <div className={Style['m-attachItem']}>
        <Upload {...uploadProps}>
          <Popover content={<p>按住CTRL可多选上传</p>} overlayClassName={Style['m-uploadHint']}>
            <Button type="primary" ghost className={Style['m-upload']}>
              <Icon type="upload" /> 上传
            </Button>
          </Popover>
        </Upload>
        <List
          grid={{ gutter: 16, column: 4 }}
          dataSource={fileArr}
          locale={{
            emptyText: (
              <div className={Style['m-void']}>
                点击‘上传’，支持jpg、png、bmp图片格式以及word、pdf等附件信息上传
              </div>
            ),
          }}
          renderItem={(item, index) => {
            const isDoc = item.enclosurePath
              ? item.enclosurePath.indexOf('.docx') > -1 || item.enclosurePath.indexOf('.doc') > -1
              : [
                  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                ].includes(item.file.type);
            const isPdf = item.enclosurePath
              ? item.enclosurePath.indexOf('.pdf') > -1
              : ['application/pdf'].includes(item.file.type);
            return (
              <List.Item key={index}>
                <Card className={Style['m-imgCard']}>
                  <Card.Meta
                    avatar={
                      <>
                        {isDoc || isPdf ? (
                          <Icon
                            type={isDoc ? 'file-word' : 'file-pdf'}
                            onClick={() => this.downFile(item)}
                          />
                        ) : (
                          <Avatar
                            src={item.enclosurePath || item.localPath}
                            onClick={() => this.viewFile(item)}
                          />
                        )}
                      </>
                    }
                    title={
                      <div className={Style['m-info']}>
                        {editFileItem.customerEnclosureId &&
                        editFileItem.customerEnclosureId === item.customerEnclosureId ? (
                          <Input
                            className={Style['m-editinput']}
                            autoComplete="off"
                            autoFocus
                            maxLength={20}
                            onBlur={(e) => this.save(e)}
                            onPressEnter={(e) => this.save(e)}
                            defaultValue={item.enclosureName}
                          />
                        ) : (
                          <span
                            className={`f-ellipsis ${Style['m-title']} ${item.isError &&
                              Style['m-error']}`}
                          >
                            {item.enclosureName}
                          </span>
                        )}
                        {!item.isError && (
                          <i
                            className={`iconfont f-fr ${Style['m-edit']}`}
                            onClick={() => this.edit(item)}
                          >
                            &#xea0a;
                          </i>
                        )}
                      </div>
                    }
                    description={
                      <>
                        {!item.isError ? (
                          !!item.percent && (
                            <Animate transitionName="fade" component="">
                              <Progress percent={item.percent} strokeWidth={6} />
                            </Animate>
                          )
                        ) : (
                          <a>重新上传</a>
                        )}
                      </>
                    }
                  />
                  <i
                    className={`iconfont ${Style['m-del']} ${item.isError && Style['m-error']}`}
                    onClick={() => this.del(item, index)}
                  >
                    &#xeb2f;
                  </i>
                </Card>
              </List.Item>
            );
          }}
        />
      </div>
    );
  }
}

UploadFile.defaultProps = {
  upType: 1,
};
export default connect(({ enclosureList, editFileItem }) => ({ enclosureList, editFileItem }))(
  UploadFile,
);
