import React from 'react';
import { Form, Input, Select } from 'antd';
import { connect, router } from 'nuomi';
import classnames from 'classnames';
import AreaCascader from '@components/AreaCascader';

import './style.less';

const { Option } = Select;

const BaseForm = ({ form, formParams, isEditing, isNationalTicket, dispatch }) => {
  const onChange = ({ areaCode }) => {
    // 获取申报地区支持的申报方式
    dispatch({
      type: '$getLoginType',
      payload: areaCode,
    });
    dispatch({
      type: '$getTaxList',
      payload: areaCode,
    });
  };

  const { getFieldDecorator } = form;
  return (
    <dl className={classnames('form-block', { 'from-disabled': !isEditing })}>
      <dt>基础信息</dt>
      <dd>
        <div className="form-row">
          <Form.Item label="申报类型">
            {getFieldDecorator('taxType', {
              initialValue:
                formParams.taxType < 0 || formParams.taxType === null ? 0 : formParams.taxType,
            })(
              <Select
                placeholder={isEditing ? '请选择申报类型' : '-'}
                disabled={!isEditing}
                getPopupContainer={(triggerNode) => triggerNode.parentNode}
              >
                <Option value={0}>非零申报</Option>
                <Option value={1}>零申报</Option>
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="主管税务机关">
            {getFieldDecorator('competentTaxAuthorities', {
              initialValue: formParams.competentTaxAuthorities,
            })(
              <Input
                placeholder={isEditing ? '请输入主管税务机关' : '-'}
                autoComplete="off"
                disabled={!isEditing}
                allowClear
              />,
            )}
          </Form.Item>
        </div>
        <div className="form-row">
          <Form.Item label="企业性质">
            {getFieldDecorator('enterprisesNature', {
              initialValue:
                formParams.enterprisesNature < 0 || !formParams.enterprisesNature
                  ? 8
                  : formParams.enterprisesNature,
            })(
              <Select
                placeholder={isEditing ? '请选择企业性质' : '-'}
                disabled={!isEditing}
                getPopupContainer={(triggerNode) => triggerNode.parentNode}
              >
                <Option value={1}>软件</Option>
                <Option value={2}>集成电路企业</Option>
                <Option value={3}>创业投资企业</Option>
                <Option value={4}>高新技术企业</Option>
                <Option value={5}>技术先进型服务企业</Option>
                <Option value={6}>动漫企业</Option>
                <Option value={7}>科技型中小企业</Option>
                <Option value={8}>其他</Option>
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="申报所属地">
            {getFieldDecorator('areaCode', {
              initialValue: { areaCode: formParams.areaCode, areaName: formParams.areaName },
              rules: isNationalTicket
                ? [
                    {
                      required: true,
                      message: '请选择申报所属地',
                    },
                  ]
                : [],
            })(
              <AreaCascader
                onChange={onChange}
                placeholder={isEditing ? '请输入申报所属地' : '-'}
                disabled={!isEditing}
                getPopupContainer={(triggerNode) => triggerNode.parentNode}
              />,
            )}
          </Form.Item>
        </div>
      </dd>
    </dl>
  );
};

const mapStateToProps = ({ formParams, isEditing, isNationalTicket }) => ({
  formParams,
  isEditing,
  isNationalTicket,
});

export default connect(mapStateToProps)(Form.create()(BaseForm));
