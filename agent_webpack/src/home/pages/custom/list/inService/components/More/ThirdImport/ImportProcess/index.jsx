// 第三方导入弹窗 > 选择新增客户弹窗 > 导入进度+导入结果
import React, { PureComponent } from 'react';
import { connect } from 'nuomi';
import ImportResult from '../ImportResult';
import ProgressItem from '../ProgressItem';

const ImportProcess = (props) => {
  const { importProgressVisible, importResultVisible } = props;
  return (
    <>
      {importProgressVisible && <ProgressItem />}
      {importResultVisible && <ImportResult />}
    </>
  );
};
export default connect(({ importProgressVisible, importResultVisible }) => ({
  importProgressVisible,
  importResultVisible,
}))(ImportProcess);
