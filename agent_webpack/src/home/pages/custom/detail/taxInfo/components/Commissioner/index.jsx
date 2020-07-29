import React from 'react';
import { Form, Input } from 'antd';
import { connect } from 'nuomi';
import { InputLimit } from '@components/InputLimit';

import './style.less';

const Commissioner = ({ form, formParams, isEditing }) => {
  const { getFieldDecorator } = form;
  return (
    <dl className="form-block" styleName="commissioner-block">
      <p styleName="commissioner-label">专管员联系方式</p>
      <dd styleName="commissioner-dd">
        <div className="form-row">
          <Form.Item label="专管员姓名">
            {getFieldDecorator('commissioner', {
              initialValue: formParams.commissioner,
            })(
              <InputLimit
                maxLength={15}
                placeholder={isEditing ? '请输入姓名' : '-'}
                autoComplete="off"
                disabled={!isEditing}
              />,
            )}
          </Form.Item>
          <Form.Item label="专管员电话">
            {getFieldDecorator('commissionerPhone', {
              initialValue: formParams.commissionerPhone,
              rules: [{ pattern: /^1(3|4|5|7|8)\d{9}$/, message: '电话格式不正确' }],
            })(
              <Input
                placeholder={isEditing ? '请输入专管员电话' : '-'}
                autoComplete="off"
                disabled={!isEditing}
              />,
            )}
          </Form.Item>
        </div>
        <div className="form-row">
          <Form.Item label="地址">
            {getFieldDecorator('commissionerAddress', {
              initialValue: formParams.commissionerAddress,
              rules: [{ max: 100, message: '地址最多100字' }],
            })(
              <Input
                placeholder={isEditing ? '请输入地址' : '-'}
                autoComplete="off"
                disabled={!isEditing}
              />,
            )}
          </Form.Item>
          <Form.Item label="备注">
            {getFieldDecorator('commissionerRemark', {
              initialValue: formParams.commissionerRemark,
              rules: [{ max: 100, message: '备注最多100字' }],
            })(
              <Input
                placeholder={isEditing ? '请输入备注' : '-'}
                autoComplete="off"
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

export default connect(mapStateToProps)(Form.create()(Commissioner));
