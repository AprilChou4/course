// 新增员工 > 批量导入弹窗 > 失败记录
import React, { PureComponent } from 'react';
import { Modal, List } from 'antd';
import PropTypes from 'prop-types';
import { connect } from 'nuomi';
import ExportText from '@components/ExportText';
import Style from './style.less';

class FailRecord extends PureComponent {
  // 关闭弹窗
  onCancel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'updateState',
      payload: {
        batchFailVisible: false,
      },
    });
  };

  // 查看失败记录
  lookFailRecord = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'updateState',
      payload: {
        batchFailVisible: true,
      },
    });
  };

  render() {
    const { batchFailVisible, failList, failDownPath } = this.props;
    return (
      <>
        <a onClick={this.lookFailRecord}>查看失败记录</a>
        <Modal
          title="失败记录"
          width={460}
          height={500}
          onCancel={this.onCancel}
          okText={
            <ExportText url={failDownPath} method="get">
              下载结果
            </ExportText>
          }
          cancelText="关闭"
          visible={batchFailVisible}
          destroyOnClose
          centered
          maskClosable={false}
          className={Style['m-failRecord']}
        >
          <List
            size="small"
            dataSource={failList}
            renderItem={(item) => <List.Item>{item}</List.Item>}
          />
        </Modal>
      </>
    );
  }
}
FailRecord.defaultProps = {
  // 失败记录列表
  failList: [],
  // 失败记录下载地址
  failDownPath: '',
};
FailRecord.propTypes = {
  failList: PropTypes.array,
  failDownPath: PropTypes.string,
};
export default connect(({ batchFailVisible }) => ({ batchFailVisible }))(FailRecord);
