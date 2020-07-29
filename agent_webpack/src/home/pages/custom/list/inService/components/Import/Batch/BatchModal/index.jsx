// 新增客户 > 批量导入弹窗
import React, { PureComponent } from 'react';
import { Modal, Timeline, Row, Col, Spin } from 'antd';
import { connect } from 'nuomi';
import ExportText from '@components/ExportText';

import ImportBtn from '../ImportBtn'; // 导入客户按钮
import Style from './style.less';

class BatchModal extends PureComponent {
  state = {
    // 上传加载
    loading: false,
    // 是否有文件上传
    isChange: false,
  };

  // 关闭弹窗
  onCancel = () => {
    const { dispatch } = this.props;
    const { isChange } = this.state;
    if (isChange) {
      dispatch({
        type: '$serviceCustomerList',
        payload: {
          current: 1,
        },
      });
    }
    dispatch({
      type: 'updateState',
      payload: {
        batchVisible: false,
      },
    });
  };

  render() {
    const { batchVisible } = this.props;
    const { loading } = this.state;
    return (
      <Spin spinning={loading} tip="正在上传...">
        <Modal
          title="批量导入客户"
          width={680}
          onCancel={this.onCancel}
          footer={null}
          visible={batchVisible}
          destroyOnClose
          centered
          maskClosable={false}
          className={Style['m-batchImport']}
        >
          <Timeline mode="left">
            <Timeline.Item dot={<div className={Style['m-step']}>1</div>}>
              <Row>
                <Col span={4}>
                  <h3>第一步：</h3>
                </Col>
                <Col span={20}>
                  <h3>
                    请下载
                    <ExportText
                      className={Style['m-down']}
                      url={`${basePath}instead/v2/customer/download.do`}
                      method="get"
                    >
                      <i className="iconfont">&#xea9f;</i>最新Excel模板
                    </ExportText>
                    并将数据按照模板格式整理。
                    <small>（模板已于2017-08-22 19:32:45更新）</small>
                  </h3>
                </Col>
              </Row>
            </Timeline.Item>
            <Timeline.Item dot={<div className={Style['m-step']}>2</div>}>
              <Col span={4}>
                <h3>第二步：</h3>
              </Col>
              <Col span={20}>
                <ImportBtn setState={(data) => this.setState(data)} />
              </Col>
            </Timeline.Item>
          </Timeline>
        </Modal>
      </Spin>
    );
  }
}

export default connect(({ batchVisible }) => ({ batchVisible }))(BatchModal);
