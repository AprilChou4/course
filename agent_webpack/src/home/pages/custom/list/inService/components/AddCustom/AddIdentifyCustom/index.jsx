// 新增客户>识别新增
import React, { Component } from 'react';
import { connect } from 'nuomi';
import { Form, Spin, Button } from 'antd';
import ShowConfirm from '@components/ShowConfirm';
import Authority from '@components/Authority';
import FirstStep from './FirstStep';
import ServiceInfo from '../ServiceInfo';

const formItemLayout = {
  labelCol: {
    sm: { span: 7 },
  },
  wrapperCol: {
    sm: { span: 17 },
  },
};
@Form.create()
class AddIdentifyCustom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      curStep: 1, // 1=第一步 2= 第二步
    };
  }

  // 下一步
  next = () => {
    const {
      dispatch,
      form: { validateFields },
      scanSubData,
    } = this.props;
    validateFields((err, values) => {
      const combineData = {
        ...scanSubData,
        ...values,
      };
      combineData.establishmentDate =
        combineData.establishmentDate && combineData.establishmentDate.format('YYYY-MM-DD');
      if (!err) {
        dispatch({
          type: 'updateState',
          payload: {
            scanSubData: combineData,
          },
        });
        this.setState({
          curStep: 2,
        });
      }
    });
  };

  // 上一步
  prev = () => {
    const {
      dispatch,
      form: { validateFields },
      scanSubData,
    } = this.props;
    validateFields((err, values) => {
      const combineData = {
        ...scanSubData,
        ...values,
      };
      if (!err) {
        dispatch({
          type: 'updateState',
          payload: {
            scanSubData: combineData,
          },
        });
        this.setState({
          curStep: 1,
        });
      }
    });
  };

  /**
   * 识别新增保存
   * flag true=保存并建账 false=保存
   */
  save = (flag) => {
    const {
      dispatch,
      form: { validateFields },
      scanSubData,
    } = this.props;

    validateFields((err, values) => {
      if (!err) {
        const { fileList, fileUrl, ...rest } = scanSubData;
        const subData = { ...rest, ...values };
        if (flag && !subData.serviceType.includes(0)) {
          ShowConfirm({
            title: '勾选“代理记账”才能进行建账操作',
            type: 'warning',
            width: 288,
          });
          return false;
        }
        delete subData.serviceType;
        dispatch({
          type: '$scanAddCustomer',
          payload: {
            ...subData,
            flag,
          },
        });
      }
    });
  };

  render() {
    const { form, loadings } = this.props;
    const { curStep } = this.state;
    return (
      <Form {...formItemLayout}>
        {curStep === 1 ? <FirstStep form={form} /> : <ServiceInfo form={form} />}

        <div className="f-tac e-mb20">
          {curStep === 1 ? (
            <Button type="primary" onClick={() => this.next()}>
              下一步
            </Button>
          ) : (
            <>
              <Button className="e-mr20" onClick={() => this.prev()}>
                上一步
              </Button>
              <Authority code="10">
                <Button
                  className="e-mr20"
                  onClick={() => this.save(true)}
                  loading={!!loadings.$scanAddCustomer}
                >
                  保存并建账
                </Button>
              </Authority>
              <Button
                type="primary"
                onClick={() => this.save(false)}
                loading={!!loadings.$scanAddCustomer}
              >
                保存
              </Button>
            </>
          )}
        </div>
      </Form>
    );
  }
}
export default connect(({ loadings, scanSubData }) => ({
  loadings,
  scanSubData,
}))(AddIdentifyCustom);
