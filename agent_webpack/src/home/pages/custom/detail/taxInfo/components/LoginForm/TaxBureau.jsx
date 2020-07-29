// 电子税务局系统的登录方式
import React from 'react';
import { connect } from 'nuomi';
import { Form, Input, Select } from 'antd';
import { useSelectOpts, useLoginType } from './util';
import placeholderMap from './placeholderMap';

import './style.less';

const { Option } = Select;

// 登录方式下拉框，根据申报所在地，有所变化
const loginOptions = [
  { label: '用户名登录', value: 0 },
  { label: 'CA登录', value: 1 },
  { label: '税控设备登录', value: 2 },
  { label: '金税盘登录', value: 3 },
  { label: '短信验证码登录', value: 4 },
]; // 登录方式下拉框，根据申报所在地，有所变化

function TaxBureau({
  form,
  loginModeForm,
  areaName,
  smsverificationData,
  supportLoginTypes,
  isEditing,
  isNationalTicket,
}) {
  const { getFieldDecorator } = form;

  // 获取到登录方式、对应登录方式字段数组
  const { loginType, loginFileds } = useLoginType(loginModeForm, 'loginType');

  // 根据申报所属地，下拉出不同登录方式
  const finalOptions = useSelectOpts(loginOptions, supportLoginTypes);

  if (!finalOptions.length) return null;

  // 根据登录方式，算出初始值字段
  const nameKey = loginFileds[0];
  const passWordKey = loginFileds[1];
  const indentityKey = loginFileds[2];
  const phoneKey = loginFileds[3];

  // 电子税务局-用户名Field
  const getUserNameField = () => {
    if (![0, 3, 4].includes(loginType)) return null;
    // 短信验证码方式根据后端返回是否隐藏
    if (loginType === 4 && smsverificationData.sMSVerificationUserName === 2) {
      return null;
    }
    // 根据申报所属地，展示不同placeholder
    let inputPlaceholder = `${placeholderMap[String(areaName).split('-')[0]] || ''}用户名`;
    let rules = [{ required: true, message: '请输入用户名' }];
    // 短信验证码方式根据后端返回是否必填
    if (loginType === 4) {
      inputPlaceholder = '统一社会信用代码';
      rules =
        smsverificationData.sMSVerificationUserName === 0
          ? []
          : [
              { required: true, message: '请输入统一社会信用代码' },
              {
                pattern: /^[a-zA-Z0-9]{15,20}$/,
                message: '格式有误，须为15~20位数字、字母',
              },
            ];
    }
    return (
      <Form.Item label="用户名">
        {getFieldDecorator(nameKey, {
          initialValue: loginModeForm[nameKey],
          rules,
        })(
          <Input
            placeholder={isEditing ? `请输入${inputPlaceholder}` : '-'}
            disabled={!isEditing}
            autoComplete="off"
          />,
        )}
      </Form.Item>
    );
  };

  // 电子税务局-密码Field
  const getPasswordField = () => {
    if (!passWordKey) return null;
    // 短信验证码方式根据后端返回是否隐藏
    if (loginType === 4 && smsverificationData.sMSVerificationPassword === 2) {
      return null;
    }
    let rules = [{ required: true, message: '请输入密码' }];
    // 短信验证码方式根据后端返回是否必填
    if (loginType === 4) {
      rules = smsverificationData.sMSVerificationPassword === 0 ? [] : rules;
    }
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

  // 电子税务局-登录身份
  const getLoginIdentity = () => {
    if (loginType !== 4) return null;
    // 短信验证码方式根据后端返回是否隐藏
    if (smsverificationData.sMSVerificationLoginIdentity === 2) {
      return null;
    }
    let rules = [];
    // 短信验证码方式根据后端返回是否必填
    if (smsverificationData.sMSVerificationLoginIdentity === 1) {
      rules = [{ required: true, message: '请选择登录身份' }];
    }
    const selectOptions = smsverificationData.loginIdentityInfoList || [];
    let initialValue = String(loginModeForm[indentityKey]);
    // 下拉框不存在属性，修改成undefined，防止页面出现数字
    const equalIndex = selectOptions.findIndex((item) => item.loginIdentityValue === initialValue);
    initialValue = equalIndex > -1 ? initialValue : undefined;
    return (
      <Form.Item label="登录身份">
        {getFieldDecorator(indentityKey, {
          // eslint-disable-next-line
          initialValue,
          rules,
        })(
          <Select
            placeholder={isEditing ? '请选择登录身份' : '-'}
            disabled={!isEditing}
            getPopupContainer={(triggerNode) => triggerNode.parentNode}
          >
            {selectOptions.map((item) => (
              <Option key={item.loginIdentityValue} value={item.loginIdentityValue}>
                {item.loginIdentityName}
              </Option>
            ))}
          </Select>,
        )}
      </Form.Item>
    );
  };

  // 电子税务局-手机号
  const getLoginPhone = () => {
    if (loginType !== 4) return null;
    // 短信验证码方式根据后端返回是否隐藏
    if (smsverificationData.sMSVerificationPhoneNum === 2) {
      return null;
    }
    let rules = [];
    // 短信验证码方式根据后端返回是否必填
    if (smsverificationData.sMSVerificationPhoneNum === 1) {
      rules = [
        { required: true, message: '请输入手机号码' },
        { pattern: /^[1][0-9]{10}$/, message: '手机号格式错误' },
      ];
    }
    return (
      <Form.Item label="手机号码">
        {getFieldDecorator(phoneKey, {
          initialValue: loginModeForm[phoneKey],
          rules,
        })(
          <Input
            placeholder={isEditing ? '请输入手机号码' : '-'}
            disabled={!isEditing}
            autoComplete="off"
          />,
        )}
      </Form.Item>
    );
  };

  return (
    <div className="form-row" style={{ marginBottom: 12 }}>
      <Form.Item label="电子税务局">
        {getFieldDecorator('loginType', {
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
      {loginType !== undefined && (
        <div styleName="login-wrap">
          {getUserNameField()}
          {getPasswordField()}
          {getLoginIdentity()}
          {getLoginPhone()}
        </div>
      )}
    </div>
  );
}

const mapStateToProps = ({
  isEditing,
  loginModeForm,
  formParams,
  smsverificationData,
  declarationTypes,
  isNationalTicket,
}) => ({
  isEditing,
  loginModeForm,
  smsverificationData,
  supportLoginTypes: declarationTypes,
  areaName: formParams.areaName,
  isNationalTicket,
});

export default connect(mapStateToProps)(TaxBureau);
