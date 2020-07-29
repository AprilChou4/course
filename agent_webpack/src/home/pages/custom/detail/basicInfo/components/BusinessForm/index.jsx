import React from 'react';
import { Form, Input, Select, InputNumber, DatePicker } from 'antd';
import { connect } from 'nuomi';
import moment from 'moment';

import './style.less';

const { Option } = Select;
const { TextArea } = Input;
const MAX_NUMBER = 999999999.99;

const BusinessForm = ({ isEditing, form, formParams }) => {
  const { getFieldDecorator } = form;

  return (
    <dl className="form-block">
      <dt>工商信息</dt>
      <dd>
        <div className="form-row">
          <Form.Item label="登记注册类型">
            {getFieldDecorator('registrationType', {
              initialValue:
                formParams.registrationType < 1 ? undefined : formParams.registrationType,
            })(
              <Select
                placeholder={isEditing ? '请选择登记注册类型' : '-'}
                disabled={!isEditing}
                showSearch
                filterOption={(inputValue, option) => {
                  return option.props.children.indexOf(inputValue) > -1;
                }}
                allowClear
                getPopupContainer={(triggerNode) => triggerNode.parentNode}
              >
                <Option value={1}>国有企业</Option>
                <Option value={2}>集体企业</Option>
                <Option value={3}>股份合作企业</Option>
                <Option value={4}>联营企业</Option>
                <Option value={5}>有限责任公司</Option>
                <Option value={6}>股份有限公司</Option>
                <Option value={7}>私营企业</Option>
                <Option value={8}>其他企业</Option>
                <Option value={9}>合资经营企业(港或澳、台资)</Option>
                <Option value={10}>合作经营企业(港或澳、台资)</Option>
                <Option value={11}>港、澳、台商独资经营企业</Option>
                <Option value={12}>港、澳、台商投资股份有限公司</Option>
                <Option value={13}>其他港、澳、台商投资企业</Option>
                <Option value={14}>中外合资经营企业</Option>
                <Option value={15}>中外合作经营企业</Option>
                <Option value={16}>外资企业</Option>
                <Option value={17}>外商投资股份有限公司</Option>
                <Option value={18}>其他外商投资企业</Option>
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="法定代表人">
            {getFieldDecorator('representative', {
              initialValue: formParams.representative,
            })(
              <Input
                placeholder={isEditing ? '请输入法定代表人' : '-'}
                autoComplete="off"
                disabled={!isEditing}
              />,
            )}
          </Form.Item>
        </div>
        <div className="form-row">
          <Form.Item label="注册资本（元）">
            {getFieldDecorator('registeredCapital', {
              initialValue:
                formParams.registeredCapital < 0 ? undefined : formParams.registeredCapital,
            })(
              <InputNumber
                max={MAX_NUMBER}
                placeholder={isEditing ? '请输入注册资本' : '-'}
                autoComplete="off"
                min={0}
                disabled={!isEditing}
              />,
            )}
          </Form.Item>
          <Form.Item label="成立日期">
            {getFieldDecorator('establishmentDate', {
              initialValue: formParams.establishmentDate
                ? moment(formParams.establishmentDate)
                : null,
            })(
              <DatePicker placeholder={isEditing ? '请选择成立日期' : '-'} disabled={!isEditing} />,
            )}
          </Form.Item>
        </div>
        <div className="form-row">
          <Form.Item label="登记机关">
            {getFieldDecorator('registrationAuthority', {
              initialValue: formParams.registrationAuthority,
            })(
              <Input
                placeholder={isEditing ? '请输入登记机关' : '-'}
                autoComplete="off"
                disabled={!isEditing}
              />,
            )}
          </Form.Item>
          <Form.Item label="注册地址">
            {getFieldDecorator('registrationAddress', {
              initialValue: formParams.registrationAddress,
            })(
              <Input
                placeholder={isEditing ? '请输入注册地址' : '-'}
                autoComplete="off"
                disabled={!isEditing}
              />,
            )}
          </Form.Item>
        </div>
        <div className="form-row">
          <Form.Item label="经营范围" styleName="business-scope-form-item">
            {getFieldDecorator('businessScope', {
              initialValue: formParams.businessScope,
            })(
              <TextArea
                placeholder={isEditing ? '请输入经营范围' : '-'}
                autoSize={{ minRows: 3, maxRows: 3 }}
                disabled={!isEditing}
              />,
            )}
          </Form.Item>
        </div>
      </dd>
    </dl>
  );
};

const mapStateToProps = ({ formParams, isEditing }) => ({
  formParams,
  isEditing,
});

export default connect(mapStateToProps)(BusinessForm);
