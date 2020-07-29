// excel导入数据不正确检查
import React, { Component } from 'react';
import { connect } from 'nuomi';
import { util } from 'nuijs';
import { Modal, Form, Spin, message } from 'antd';
import Style from './style.less';
import importStatus from '../ImportStatus';
import ImportFile from '../../ImportFile';

const layout = {
  labelCol: {
    sm: { span: 4 },
  },
  wrapperCol: {
    sm: { span: 20 },
  },
};
const FormItem = Form.Item;
@Form.create()
class ExcelFail extends Component {
  state = {
    fileList: [],
    fileName: '', // 文件名称
  };

  onOk = () => {
    const {
      form: { validateFields },
      dispatch,
      excelFailData,
    } = this.props;
    const { fileList } = this.state;
    validateFields(async (err) => {
      if (!err) {
        const { file, ...rest } = excelFailData;
        const formData = new FormData();
        fileList.forEach((files) => {
          formData.append('file', files);
        });
        Object.keys(rest).forEach((item) => {
          if (item !== 'file') {
            formData.append(item, rest[item]);
          }
        });
        dispatch({
          type: '$createExcelAccount',
          payload: formData,
        }).then((res) => {
          if (res.status === 200) {
            const { taskId } = res.data;
            importStatus({
              subtitle: '文件正在上传',
              msg: '当前文件上传进度为',
              taskId,
              success: () => {
                dispatch({
                  type: 'updateState',
                  payload: {
                    accountVisible: false,
                    excelFailVisible: false,
                    excelFailPath: '',
                  },
                });
                dispatch({
                  type: '$serviceCustomerList',
                });
              },
            });
          } else if (res.status === 300) {
            this.setState({
              fileList: [],
              fileName: '',
            });
            message.error(res.message);
          } else {
            message.error(res.message);
          }
        });
      }
    });
  };

  onCancel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'updateState',
      payload: {
        excelFailVisible: false,
        excelFailPath: '',
      },
    });
  };

  // 下载模板
  downExcel = () => {
    const { excelFailPath } = this.props;
    util.location(
      `${basePath}jz/cloud/forwardInterface/exportResult.do?path=${excelFailPath}`,
      '_blank',
    );
  };

  render() {
    const { loadings, form, excelFailVisible } = this.props;
    const { getFieldDecorator } = form;
    const { fileList, fileName } = this.state;
    return (
      <Modal
        title="导入检查"
        okText="重新上传"
        centered
        width={540}
        // visible={visible}
        visible={excelFailVisible}
        onOk={this.onOk}
        onCancel={this.onCancel}
        className={Style['m-excelFail']}
      >
        <Spin spinning={loadings.$createExcelAccount}>
          <Form>
            <div className={Style['m-hint']}>
              本次导入的表格中，数据有误，系统已经为您生成了新的导入模板，并将错误的原因标注在新的模板里，请手动
              <a onClick={this.downExcel}>下载Excel建账模板.xls</a>
              ，然后根据提示修改后重新上传模板
            </div>
            <FormItem label="导入模板" {...layout}>
              {getFieldDecorator('file', {
                initialValue: fileName,
                rules: [
                  {
                    required: true,
                    message: '请选择文件',
                  },
                ],
              })(
                <ImportFile
                  fileName={fileName}
                  fileList={fileList}
                  setData={(data) => this.setState(data)}
                  form={form}
                />,
              )}
            </FormItem>
          </Form>
        </Spin>
      </Modal>
    );
  }
}
export default connect(
  ({ loadings, currRecord, excelFailVisible, excelFailData, excelFailPath }) => ({
    loadings,
    currRecord,
    excelFailVisible,
    excelFailData,
    excelFailPath,
  }),
)(ExcelFail);
