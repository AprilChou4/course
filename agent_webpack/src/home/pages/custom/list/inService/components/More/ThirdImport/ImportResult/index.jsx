// 第三方导入 > 导入进度条导入结果
import React, { PureComponent } from 'react';
import { connect } from 'nuomi';
import { Modal } from 'antd';
import SuperTable from '@components/SuperTable';
import ExportText from '@components/ExportText';
import services from '../../../../services';
import Style from './style.less';

class ImportResult extends PureComponent {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '序号',
        dataIndex: 'index',
        align: 'center',
        width: 60,
        render: (value, record, index) => index,
      },
      {
        title: '客户名称',
        dataIndex: 'name',
        className: 'th-center',
        width: 300,
        render: (value) => value,
      },
      {
        title: '导入结果',
        dataIndex: 'exception',
        className: 'th-center',
        width: 300,
        render: (value, record) => value,
      },
    ];
    this.state = {
      dataSource: [],
    };
  }

  async componentDidMount() {
    const { dispatch } = this.props;
    const data = await services.getThirdImportResult();
    this.setState({
      dataSource: data,
    });
  }

  onOk = () => {};

  onCancel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'updateState',
      payload: {
        importResultVisible: false,
      },
    });
  };

  render() {
    const { dataSource } = this.state;
    const { importResultVisible } = this.props;
    return (
      <Modal
        visible={importResultVisible}
        width={714}
        centered
        title="导入结果"
        cancelText="关闭导账信息"
        okText={
          <ExportText url={`${basePath}jz/cloud/forwardInterface/exportBatchImportTaskInfo.do`}>
            导出Excel文件
          </ExportText>
        }
        onOk={this.onOk}
        onCancel={this.onCancel}
        className={Style['m-importResult']}
      >
        <SuperTable
          pagination={false}
          rowKey={(record, index) => index}
          columns={this.columns}
          dataSource={dataSource}
        />
      </Modal>
    );
  }
}
export default connect(({ importResultVisible }) => ({ importResultVisible }))(ImportResult);
