// 新增客户弹窗
import React, { PureComponent } from 'react';
import { Modal, Tabs, Spin } from 'antd';
import { connect } from 'nuomi';
import AddNomalCustom from '../AddNomalCustom';
import AddIdentifyCustom from '../AddIdentifyCustom';
import Style from './style.less';

const { TabPane } = Tabs;

class AddCustomModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      activeKey: '1',
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    // 获取客户编码、服务类型
    dispatch({
      type: '$addCustomInit',
    });
  }

  // 取消
  onCancel = () => {
    const { dispatch, scanSubData } = this.props;
    const {
      form: { getFieldValue },
    } = this.addform.props;
    dispatch({
      type: '$deleteCode',
      payload: {
        customerCode: getFieldValue('customerCode') || scanSubData.customerCode,
      },
    });
  };

  changeTab = (activeKey) => {
    this.setState({
      activeKey,
    });
  };

  render() {
    const { activeKey } = this.state;
    const { loadings, customVisible } = this.props;
    return (
      <Modal
        title={null}
        visible={customVisible}
        width={800}
        className={`ui-tab-modal ${Style['m-addClient']}`}
        onCancel={this.onCancel}
        footer={null}
        destroyOnClose
        maskClosable={false}
        centered
      >
        <Spin
          spinning={
            !!loadings.$scanAddCustomer ||
            !!loadings.$addCustomer ||
            !!loadings.$deleteCode ||
            !!loadings.$addCustomInit
          }
        >
          <Tabs
            defaultActiveKey="1"
            activeKey={activeKey}
            animated={false}
            onChange={this.changeTab}
          >
            <TabPane tab="新增客户" key="1">
              <AddNomalCustom wrappedComponentRef={(el) => (this.addform = el)} />
            </TabPane>
            <TabPane
              key="2"
              tab={
                <span>
                  识别新增
                  <div className={Style['m-newIcon']}></div>
                </span>
              }
            >
              <AddIdentifyCustom wrappedComponentRef={(el) => (this.addform = el)} />
            </TabPane>
          </Tabs>
        </Spin>
      </Modal>
    );
  }
}
export default connect(({ loadings, customVisible, scanSubData }) => ({
  loadings,
  customVisible,
  scanSubData,
}))(AddCustomModal);
