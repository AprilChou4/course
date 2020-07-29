// 带输入框按钮的上传
import React, { useState } from 'react';
import { Upload, Button } from 'antd';
import { regex } from '@utils';
import './style.less';

const ImportFileIcon = ({
  form,
  fileList,
  downExcel,
  id,
  fileName,
  className,
  setData,
  ...rest
}) => {
  // 默认=0; 重新上传=1 成功=2
  const [status, setStatus] = useState(0); // 上传状态
  const [name, setName] = useState(''); // 文件名
  const { resetFields } = form;

  // 删除文件
  const delFile = () => {
    setStatus(0);
    setName('');
    setData({
      fileList: [],
      fileName: '',
    });
    resetFields && resetFields(id, '');
  };
  const props = {
    beforeUpload: (file) => {
      setName(file.name);
      if (!regex.excel.test(file.name)) {
        setStatus(1);
        return false;
      }
      setData({
        fileList: [file],
        fileName: file.name,
      });
      setStatus(2);
      return false;
    },
    showUploadList: false,
    fileList,
    className: 'm-upload',
  };
  return (
    <div className={`ui-importFileIcon f-clearfix ${className || ''}`} {...rest}>
      {status === 1 && (
        <span className="m-hint">
          <i className="iconfont">&#xec93;</i>
          文件格式错误，请检查后重新上传
        </span>
      )}
      {status === 0 && <i className="iconfont m-icon">&#xec7f;</i>}
      {(status === 0 || status === 1) && (
        <>
          <Upload {...props}>
            <Button type="primary" {...(status === 0 ? {} : { ghost: true })}>
              {status === 0 ? '点我上传' : '重新上传'}
            </Button>
          </Upload>
          <div className="m-state">
            <p>支持20M内拓展名为.xls、.xlsx、.csv的文件</p>
            <p>
              或使用 <a onClick={downExcel}>Excel建账模板.xls</a>
            </p>
          </div>
        </>
      )}
      {status === 2 && (
        <div className="m-success">
          <i className="iconfont">&#xe609;</i>
          {name}
          <i className="iconfont m-close" onClick={delFile}>
            &#xedb0;
          </i>
        </div>
      )}
    </div>
  );
  // }
};
ImportFileIcon.defaultProps = {
  // 上传文件
  fileList: [],
  // 输入框内容
  fileName: '',
  // 改变父组件state
  setData() {},
  form: {},
};
// ImportFileIcon.propTypes = {
//   fileList: PropTypes.array,
//   fileName: PropTypes.string,
//   setData: PropTypes.func,
//   form: PropTypes.object,
// };
export default ImportFileIcon;
