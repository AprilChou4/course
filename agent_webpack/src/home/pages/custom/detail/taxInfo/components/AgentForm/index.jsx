import React from 'react';
import { Form, Input } from 'antd';
import { connect } from 'nuomi';
import classnames from 'classnames';
import { InputLimit } from '@components/InputLimit';

import './style.less';

const AgentForm = ({ form, formParams, isEditing }) => {
  const { getFieldDecorator } = form;
  return (
    <dl className={classnames('form-block', { 'from-disabled': !isEditing })}>
      <dt>经办人信息</dt>
      <dd>
        <div className="form-row" styleName="agent-info-row">
          <Form.Item label="经办人">
            {getFieldDecorator('agent', {
              initialValue: formParams.agent,
            })(
              <InputLimit
                placeholder={isEditing ? '请填写经办人' : '-'}
                disabled={!isEditing}
                maxLength={15}
              />,
            )}
          </Form.Item>
          <Form.Item label="经办人手机号">
            {getFieldDecorator('agentPhone', {
              initialValue: formParams.agentPhone,
              rules: [
                {
                  pattern: /^[1]([3-9])[0-9]{9}$/,
                  message: '手机号格式有误',
                },
              ],
            })(
              <Input placeholder={isEditing ? '请填写经办人手机号' : '-'} disabled={!isEditing} />,
            )}
          </Form.Item>
          <Form.Item label="经办人身份证">
            {getFieldDecorator('agentId', {
              initialValue: formParams.agentId,
              rules: [
                {
                  pattern: /^[a-zA-Z0-9]{15,18}$/,
                  message: '身份证格式有误',
                },
              ],
            })(
              <Input placeholder={isEditing ? '请填写经办人身份证' : '-'} disabled={!isEditing} />,
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

export default connect(mapStateToProps)(Form.create()(AgentForm));
