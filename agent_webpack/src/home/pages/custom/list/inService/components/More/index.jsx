// 更多按钮
import React from 'react';
import { connect } from 'nuomi';
import DropDown from '@components/DropDown';
import Authority from '@components/Authority';
import ExportCustom from './ExportCustom'; // 导出
import DeleteCustom from './DeleteCustom'; // 删除
import CustomColumn from './CustomColumn'; // 自定义列
import StopService from './StopService'; // 停止服务
import ImportCode from './ImportCode'; // 导入授权码
import ThirdImport from './ThirdImport';

const style = {
  marginLeft: 12,
};

const More = (props) => {
  const { importProgressVisible } = props;
  const isDisabled = importProgressVisible ? { disabled: true } : {};
  return (
    <DropDown style={style} {...isDisabled}>
      <Authority code="11">
        <ExportCustom />
      </Authority>
      <Authority code="6">
        <DeleteCustom />
      </Authority>

      <Authority code="7">
        <StopService />
      </Authority>

      <CustomColumn />

      <Authority code="272">
        <ImportCode />
      </Authority>

      <Authority code="4">
        <ThirdImport />
      </Authority>
    </DropDown>
  );
};

export default connect(({ importProgressVisible }) => ({ importProgressVisible }))(More);
