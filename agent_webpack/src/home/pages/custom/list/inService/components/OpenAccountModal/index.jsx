// 开户确认弹窗
import React, { Component } from 'react';
import { Modal, Spin, Input, Form } from 'antd';
import { connect } from 'nuomi';
import Style from './style.less';

const formItemLayout = {
  labelCol: {
    sm: { span: 8 },
  },
  wrapperCol: {
    sm: { span: 16 },
  },
};
@Form.create()
class OpenAccountModal extends Component {
  // 确定
  onOk = () => {
    const {
      dispatch,
      form: { validateFields },
      currRecord: { customerId },
    } = this.props;
    validateFields((errs, values) => {
      if (!errs) {
        dispatch({
          type: '$updateSocialCode',
          payload: {
            ...values,
            customerId,
          },
        });
      }
    });
  };

  // 取消
  onCancel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'updateState',
      payload: {
        openAccountVisible: false,
        currRecord: {},
      },
    });
  };

  render() {
    const {
      openAccountVisible,
      loadings,
      form: { getFieldDecorator },
    } = this.props;
    return (
      <>
        {openAccountVisible && (
          <Modal
            title="温馨提示"
            visible={openAccountVisible}
            width={460}
            className={Style['m-openAccount']}
            onOk={this.onOk}
            onCancel={this.onCancel}
            destroyOnClose
            maskClosable={false}
            centered
          >
            <Spin spinning={!!loadings.$updateSocialCode}>
              <Form {...formItemLayout}>
                <div className={Style['m-hint']}>
                  系统检测到您尚未维护税号，请填写统一社会信用代码！
                </div>
                <Form.Item label="统一社会信用代码">
                  {getFieldDecorator('unifiedSocialCreditCode', {
                    rules: [
                      {
                        required: true,
                        message: '请输入统一社会信用代码',
                      },
                      {
                        pattern: /^[a-zA-Z0-9]{15,20}$/,
                        message: '格式有误，须为15~20位数字、字母',
                      },
                    ],
                  })(<Input placeholder="请输入统一社会信用代码" autoComplete="off" />)}
                </Form.Item>
              </Form>
            </Spin>
          </Modal>
        )}
      </>
    );
  }
}
export default connect(({ loadings, openAccountVisible, currRecord }) => ({
  loadings,
  openAccountVisible,
  currRecord,
}))(OpenAccountModal);
