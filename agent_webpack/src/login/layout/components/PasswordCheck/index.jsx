// 加入公司 > 密码/确认密码
import React, { useState } from 'react';
import { Form, Input } from 'antd';
import { connect } from 'nuomi';
import { constant } from '@public/script';
import Style from './style.less';

const FormItem = Form.Item;
const PasswordCheck = ({ mode, form, phoneNumInfo }) => {
  const [confirmDirty, setConfirmDirty] = useState(false); // 确认密码是否输入
  const { registerNuonuo, isMobile } = phoneNumInfo;
  const { getFieldDecorator, validateFields } = form;

  const handleConfirmBlur = (e) => {
    const { value } = e.target;
    setConfirmDirty(confirmDirty || !!value);
  };

  // 确认密码与密码对比
  const compareToFirstPassword = (rule, value, callback) => {
    if (value && value !== form.getFieldValue('password')) {
      callback('两次输入密码不一致');
    } else {
      callback();
    }
  };

  // 密码与确认密码对比
  const validateToNextPassword = (rule, value, callback) => {
    if (value && confirmDirty) {
      validateFields(['rePassword'], { force: true });
    }
    callback();
  };

  return (
    <>
      {(mode || (isMobile && !registerNuonuo)) && (
        <>
          <FormItem hasFeedback className={Style['m-passWord']}>
            {getFieldDecorator('password', {
              initialValue: '',
              ...constant.VALIDATE_TRIGGER_ONBLUR,
              rules: [
                {
                  required: true,
                  min: 6,
                  max: 35,
                  message: '请输入6-35位字符密码',
                },
                {
                  validator: validateToNextPassword,
                },
              ],
            })(
              <Input.Password
                placeholder="请输入6-35位字符密码"
                prefix={<span>密码</span>}
                size="large"
              />,
            )}
          </FormItem>
          <FormItem hasFeedback className={Style['m-passWord']}>
            {getFieldDecorator('rePassword', {
              initialValue: '',
              ...constant.VALIDATE_TRIGGER_ONBLUR,
              rules: [
                {
                  required: true,
                  message: '请再次确认密码',
                },
                {
                  validator: compareToFirstPassword,
                },
              ],
            })(
              <Input.Password
                placeholder="请再次确认密码"
                prefix={<span>确认密码</span>}
                size="large"
                onBlur={handleConfirmBlur}
              />,
            )}
          </FormItem>
        </>
      )}
    </>
  );
};
PasswordCheck.defaultProps = {
  // 是否显示
  mode: false,
};
export default connect(({ phoneNumInfo }) => ({ phoneNumInfo }))(PasswordCheck);
