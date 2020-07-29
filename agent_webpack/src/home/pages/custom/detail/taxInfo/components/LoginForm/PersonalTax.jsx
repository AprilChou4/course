// 个税扣缴系统的登录方式 #130175
import React from 'react';
import { connect, router } from 'nuomi';
import { Form, Input, Select } from 'antd';
import { useSelectOpts, useLoginType } from './util';

import './style.less';

const { Option } = Select;

// 登录方式下拉框，根据申报所在地，有所变化
const loginOptions = [
  // 个税扣缴系统支持的登录方式 #130175
  { label: '申报密码登录', value: 5 },
];

function PersonalTax({ form, loginModeForm, isNationalTicket, supportLoginTypes, isEditing }) {
  const { getFieldDecorator } = form;

  // 获取到登录方式、对应登录方式字段数组
  const { loginType, loginFileds } = useLoginType(loginModeForm, 'personalIncomeTaxLoginType');

  // 根据申报所属地，下拉出不同登录方式
  const finalOptions = useSelectOpts(loginOptions, supportLoginTypes);

  // #130946
  const { cszs: fromCszs } = router.location().query;
  if (!finalOptions.length || fromCszs) return null;

  // 根据登录方式，算出初始值字段
  const passWordKey = loginFileds[1];

  // 电子税务局-密码Field
  const getPasswordField = () => {
    if (!passWordKey) return null;
    const rules = [{ required: true, message: '请输入密码' }];
    return (
      <Form.Item label="密码">
        {getFieldDecorator(passWordKey, {
          initialValue: loginModeForm[passWordKey],
          rules,
        })(
          <Input.Password
            placeholder={isEditing ? '请输入密码' : '-'}
            disabled={!isEditing}
            maxLength={20}
            autoComplete="off"
          />,
        )}
      </Form.Item>
    );
  };

  return (
    <div className="form-row" style={{ marginBottom: 12 }}>
      <Form.Item label="个税扣缴系统">
        {getFieldDecorator('personalIncomeTaxLoginType', {
          initialValue: loginType,
          rules: isNationalTicket
            ? [
                {
                  required: true,
                  message: '请选择登录方式',
                },
              ]
            : [],
        })(
          <Select
            placeholder={isEditing ? '请选择登录方式' : '-'}
            disabled={!isEditing}
            allowClear
            getPopupContainer={(triggerNode) => triggerNode.parentNode}
          >
            {finalOptions.map((item) => (
              <Option value={item.value} key={item.value}>
                {item.label}
              </Option>
            ))}
          </Select>,
        )}
      </Form.Item>
      {loginType !== undefined && <div styleName="login-wrap">{getPasswordField()}</div>}
    </div>
  );
}

const mapStateToProps = ({ isEditing, loginModeForm, isNationalTicket, declarationTypes }) => ({
  isEditing,
  loginModeForm,
  isNationalTicket,
  supportLoginTypes: declarationTypes,
});

export default connect(mapStateToProps)(PersonalTax);
