// 恢复服务> 没有记账会计弹出层
import React, { Component } from 'react';
import { connect } from 'nuomi';
import { Modal, Form, Select, Spin } from 'antd';
import Style from './style.less';

const { Option } = Select;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
  colon: false, // 是否显示 label 后面的冒号
};
@Form.create()
class RenewModal extends Component {
  onCancel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'updateState',
      payload: {
        renewVisible: false,
      },
    });
  };

  onOk = () => {
    const {
      dispatch,
      currRecord,
      form: { validateFields },
    } = this.props;
    const { customerId } = currRecord;
    validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: '$renewCustomer',
          payload: {
            record: currRecord,
            customerId,
            ...values,
          },
        });
      }
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      loadings,
      bookeepers,
      renewVisible,
    } = this.props;

    return (
      <Modal
        width={332}
        title="温馨提示"
        className={Style['client-recovery']}
        cancelText="取消"
        okText="确定"
        centered
        destroyOnClose
        visible={renewVisible}
        maskClosable={false}
        onCancel={this.onCancel}
        onOk={this.onOk}
      >
        {/* <p className={Style['m-title']}>{message}</p> */}
        <Spin spinning={loadings.$renewCustomer}>
          <Form layout="horizontal">
            <Form.Item {...formItemLayout} label="记账会计">
              {getFieldDecorator('bookkeepingAccounting', {
                rules: [{ required: true, message: '请选择记账会计' }],
              })(
                <Select
                  placeholder="请选择"
                  showSearch
                  filterOption={(input, option) =>
                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {bookeepers.map((v) => (
                    <Option value={v.staffId} key={v.staffId}>
                      {v.realName}
                    </Option>
                  ))}
                </Select>,
              )}
            </Form.Item>
          </Form>
        </Spin>
      </Modal>
    );
  }
}
export default connect(({ loadings, currRecord, bookeepers, renewVisible }) => ({
  loadings,
  currRecord,
  bookeepers,
  renewVisible,
}))(RenewModal);
