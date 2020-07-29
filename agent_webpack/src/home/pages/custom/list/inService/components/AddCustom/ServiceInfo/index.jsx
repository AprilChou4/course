// 新增客户>服务信息以及开票信息
import React, { Component } from 'react';
import { connect } from 'nuomi';
import { Form, Row, Col, Select, Input } from 'antd';
import Title from '@components/Title';
import MultiTreeSelect from '@components/MultiTreeSelect';
import ServiceType from '@components/ServiceType';
import Bookeeper from '../../Bookeeper';

const FormItem = Form.Item;
const { Option } = Select;
const layout = {
  labelCol: {
    sm: { span: 4 },
  },
  wrapperCol: {
    sm: { span: 19 },
  },
};

class ServiceInfo extends Component {
  state = {
    // 服务类型选中值
    servivceValue: [],
  };

  onCheckBox = (checkedValue, checkedObj) => {
    const {
      form: { setFieldsValue },
    } = this.props;
    setFieldsValue({ customerServiceRelationList: checkedObj });
    this.setState({
      servivceValue: checkedValue,
    });
  };

  render() {
    const { servivceValue } = this.state;
    const {
      bookeepers,
      drawerList,
      scanSubData,
      serviceTypeList,
      form: { getFieldDecorator },
    } = this.props;

    const { serviceType, customerServiceRelationList, bookkeepingAccounting, drawer } = scanSubData;
    return (
      <>
        <div>
          <Title title="服务信息" />
          <Row>
            <Col>
              {/* 服务类型组合 */}
              {getFieldDecorator('customerServiceRelationList', {
                initialValue: customerServiceRelationList || [],
              })(<Input type="hidden" />)}
              <FormItem label="服务类型" className="form-item form-service" {...layout}>
                {getFieldDecorator('serviceType', {
                  initialValue: serviceType || [],
                  rules: [
                    {
                      required: true,
                      message: '服务类型不能为空',
                    },
                  ],
                })(<ServiceType serviceTypeList={serviceTypeList} onCheckBox={this.onCheckBox} />)}
              </FormItem>
            </Col>
          </Row>
        </div>
        {(servivceValue.includes(0) || servivceValue.includes(2)) && (
          <div>
            <Title title="派工信息" />
            <Row gutter={12}>
              {servivceValue.includes(0) && (
                <Col span={12}>
                  <Form.Item label="记账会计">
                    {getFieldDecorator('bookkeepingAccounting', {
                      initialValue: bookkeepingAccounting || undefined,
                    })(
                      <Bookeeper />,
                    )}
                  </Form.Item>
                </Col>
              )}
              {servivceValue.includes(2) && (
                <Col span={12}>
                  <FormItem label="开票员">
                    {getFieldDecorator('drawer', {
                      initialValue: drawer || [],
                    })(<MultiTreeSelect treeData={drawerList} searchPlaceholder="请选择开票员" />)}
                  </FormItem>
                </Col>
              )}
            </Row>
          </div>
        )}
      </>
    );
  }
}
export default connect(({ bookeepers, drawerList, serviceTypeList, scanSubData }) => ({
  bookeepers,
  drawerList,
  serviceTypeList,
  scanSubData,
}))(ServiceInfo);
