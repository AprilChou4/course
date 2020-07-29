// 导入授权码弹窗
import React, { PureComponent } from 'react';
import { Modal } from 'antd';
import ExportText from '@components/ExportText';

import Style from './style.less';

class FailModal extends PureComponent {
  render() {
    const { visible, closeFail, failData } = this.props;
    const { path, result, successCount, total } = failData;
    return (
      <Modal
        title="导入结果"
        visible={visible}
        width={460}
        className={Style['m-failImport']}
        onCancel={closeFail}
        footer={null}
        destroyOnClose
        maskClosable={false}
        centered
      >
        <div>
          本次批量导入授权码{total}个，其中成功匹配{successCount}个，失败{total - successCount}
          个，失败原因。请下载
          <ExportText
            url={`${basePath}jz/bill/exportBatchAddAuthCode.do`}
            data={{ path }}
            className="f-di c-primary"
          >
            【匹配失败结果】
          </ExportText>
          进行查看
        </div>
      </Modal>
    );
  }
}
FailModal.defaultProps = {
  visible: false,
  // 关闭回调、关闭弹窗
  closeFail() {},
  // 失败数据：包括下载地址
  failData: {},
};
export default FailModal;
