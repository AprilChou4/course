// 新增员工 > 批量导入弹窗 > 导入员工按钮
import React, { PureComponent } from 'react';
import { Upload, message, Button, Icon } from 'antd';
import { connect } from 'nuomi';
import { regex } from '@utils';
import FailRecord from '../FailRecord'; // 查看失败记录
import Style from './style.less';

const FILE_TYPE = [
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
]; // 文件类型 .xls, .xlsx，excel 文件类型
class ImportBtn extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      resultCode: -1, // 导入是否成功 -1=初始状态 0=存在失败 1=成功 2=status300模板不正确，请下载标准模板导入
      fileName: '', // 导入文件的名称
      failList: [], // 失败记录列表
      failDownPath: '', // 失败记录下载地址
    };
  }

  // 导入前校验
  beforeUpload = (file) => {
    if (!regex.excel.test(file.name)) {
      message.warning('请导入.xls或.xlsx格式的文件');
      return false;
    }
  };

  // 员工导入
  handleChange({ file, fileList }) {
    const { setState } = this.props;
    if (file.status === 'uploading') {
      setState({ loading: true, isChange: true });
      return;
    }
    const {
      name,
      response: { message: tipMessage, data, status },
    } = fileList.slice(-1)[0];
    if (file.status === 'done') {
      if (status === 200) {
        const { downloadPath, errorReason } = data;
        if (errorReason.length) {
          this.setState({
            resultCode: 0,
            fileName: '存在导入失败内容',
            failList: errorReason,
            failDownPath: downloadPath,
          });
        } else {
          this.setState({
            resultCode: 1,
            fileName: name,
          });
          message.success('导入成功！');
        }
      } else if (status === 300) {
        this.setState({
          resultCode: 2,
          fileName: tipMessage,
        });
      } else {
        // resultCode=0;
        message.error(tipMessage);
      }
    } else {
      message.error(tipMessage);
    }
    setTimeout(() => {
      setState({
        loading: false,
      });
    }, 100);
  }

  render() {
    const { resultCode, fileName, failList, failDownPath } = this.state;
    return (
      <>
        <Upload
          beforeUpload={this.beforeUpload.bind(this)}
          onChange={this.handleChange.bind(this)}
          action={`${basePath}instead/v2/user/staff/batchImport.do`}
          name="file"
          accept={FILE_TYPE.join(',')}
          multiple={false}
          showUploadList={false}
        >
          <Button type="primary" ghost>
            <Icon type="download" />
            导入员工
          </Button>
        </Upload>
        <h3>
          <small>提示：模板请保存为XLS或XLSX格式。</small>
        </h3>
        {
          [
            <div className={Style['m-warn']}>
              <i className="iconfont f-fl">&#xec93;</i>
              <span>
                请导入.xls.xlsx格式的文件
                <FailRecord failList={failList} failDownPath={failDownPath} />
              </span>
            </div>,
            <div className={Style['m-success']}>
              <i className="iconfont e-mr8">&#xe64b;</i>
              <span>{fileName}</span>
              <i className={`iconfont f-fr ${Style['success-icon']}`}>&#xec94;</i>
            </div>,
            <div className={Style['m-warn']}>
              <i className="iconfont f-fl">&#xec93;</i>
              <span>{fileName}</span>
            </div>,
          ][resultCode]
        }
      </>
    );
  }
}
ImportBtn.defaultProps = {
  setState() {},
};
export default connect()(ImportBtn);
