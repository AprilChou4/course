// 登录表单
import React, { useState } from 'react';
import { Form, Input, Checkbox } from 'antd';
import { LOGIN_IMAGE_CODE } from '@login/apis';
import { trim } from 'lodash';
import { Base64 } from 'js-base64';
import { connect } from 'nuomi';
import { request } from 'nuijs';
import { constant } from '@public/script';
import services from '@login/layout/services';
import { util } from '@utils';
import BigButton from '../../BigButton';
import Style from './style.less';

const LoginForm = ({ dispatch, form, versionType }) => {
  const { getFieldDecorator, validateFields, getFieldError, getFieldValue, isFieldTouched } = form;
  const [imgCodeUrl, setImgCodeUrl] = useState(`${LOGIN_IMAGE_CODE}?_=${new Date().getTime()}`);
  // 记住密码
  const keepData = localStorage.getItem('rememberPassword') || '';
  let keepLoginInfo = {};
  keepLoginInfo = keepData ? JSON.parse(Base64.decode(keepData)) : {};

  // 更新图片验证码
  const updateImgCode = () => {
    setImgCodeUrl(`${LOGIN_IMAGE_CODE}?_=${new Date().getTime()}`);
  };
  // 点击登录请求登录接口
  const handleSubmit = (e) => {
    e.preventDefault();
    validateFields((err, values) => {
      const { password, username, ...rest } = values;
      if (!err) {
        dispatch({
          type: '$userLogin',
          payload: {
            password: Base64.encode(password),
            username: trim(username),
            updateImgCode,
            ...rest,
          },
        });
      }
    });
  };

  // 立即注册
  const register = () => {
    dispatch({
      type: 'updateState',
      payload: {
        registerVisible: true,
        loginVisible: false,
      },
    });
  };
  // 加入公司
  const join = () => {
    dispatch({
      type: 'updateState',
      payload: {
        loginVisible: false,
        joinCompanyVisible: true,
        selectedCompanyType: 1,
        joinSource: 1,
      },
    });
  };

  // 忘记密码
  const forget = () => {
    // 有账号且验证通过 无账号则先验证
    const isChecked =
      (isFieldTouched('username') || getFieldValue('username')) && !getFieldError('username');
    !isFieldTouched('username') && validateFields(['username']);
    if (!isChecked) {
      return false;
    }
    request(
      {
        url: 'instead/v2/user/getSource.do',
        data: { username: getFieldValue('username') },
        type: 'POST',
        dataType: 'text',
        async: false,
        success(res) {
          if (res.data === 'nuocity') {
            util.location(
              'http://www.nuocity.com/xnw_user_ssoservice/userBussinessController.htm?url2=http://www.nuocity.com/xnw_user_ssoservice/login?service=http%3A%2F%2Fwww.nuocity.com%2Fxnw%2Fzz%2Flogin.jspx%3FreturnUrl%3D%2F',
              '_blank',
            );
          } else {
            util.location(
              'http://u.jss.com.cn/Contents/usercenter/allow/retrieve/retrieve.jsp',
              '_blank',
            );
          }
        },
      },
      '正在跳转...',
    );
  };

  // 获取提示信息
  const getHintInfo = (data) => {
    const { registerDz, registerJz, notActivatePhone, applyForCompany, notJoinCompanyPhone } = data;
    // 立即开通云记账
    const openJz = () => {
      dispatch({
        type: 'updateState',
        payload: {
          registerStep: 1,
          versionType: 0,
          loginVisible: false,
          registerVisible: true,
        },
      });
    };
    // 立即开通云代账
    const openDz = () => {
      dispatch({
        type: 'updateState',
        payload: {
          registerStep: 1,
          versionType: 1,
          loginVisible: false,
          registerVisible: true,
        },
      });
    };
    return (
      <>
        {versionType === 0 && !registerJz && registerDz && (
          <p>
            当前手机号未开通云记账，<a onClick={openJz}>是否开通？</a>
          </p>
        )}
        {versionType === 1 &&
          registerJz &&
          !registerDz &&
          !notActivatePhone &&
          !applyForCompany &&
          !notJoinCompanyPhone && (
            <p>
              当前手机号未开通云代账，<a onClick={openDz}>是否开通？</a>
            </p>
          )}
      </>
    );
  };

  // 检验手机号当前状态
  const validatorPhone = async (rule, value, callback) => {
    const data = await services.checkPhone({ phoneNum: value });
    const mobileData = {
      isMobile: constant.REGEX.mobile.test(value),
      ...data,
    };
    dispatch({
      type: 'updateState',
      payload: {
        phoneNumInfo: mobileData,
      },
    });
    const { registerDz, registerJz, notActivatePhone, notJoinCompanyPhone } = mobileData;
    const info = getHintInfo(mobileData);
    if (
      (versionType === 0 && !registerJz && registerDz) ||
      (versionType === 1 && registerJz && !registerDz && !notActivatePhone && !notJoinCompanyPhone)
    ) {
      callback(info);
    } else {
      callback();
    }
  };

  return (
    <Form onSubmit={handleSubmit} className={Style['login-form']}>
      <div className="noSub" style={{ height: 0, overflow: 'hidden' }}>
        <input type="text" name="disusername" />
        <input type="password" name="dispassword" />
      </div>
      {getFieldDecorator('versionType', {
        initialValue: versionType,
      })(<Input type="hidden" />)}
      <Form.Item>
        {getFieldDecorator('username', {
          initialValue: keepLoginInfo.username || '',
          ...constant.VALIDATE_TRIGGER_ONBLUR,
          rules: [
            { required: true, message: '请输入手机号/用户名' },
            // {
            //   pattern: constant.REGEX.taxnum,
            //   message: '用户名格式错误',
            // },
            versionType !== 2 && {
              validator: validatorPhone,
            },
          ],
        })(<Input placeholder="手机号/用户名" size="large" autoComplete="off" />)}
      </Form.Item>
      <Form.Item>
        {getFieldDecorator('password', {
          initialValue: keepLoginInfo.password ? Base64.decode(keepLoginInfo.password) : '',
          ...constant.VALIDATE_TRIGGER_ONBLUR,
          rules: [{ required: true, message: '请输入密码' }],
        })(<Input.Password placeholder="请输入密码" size="large" autoComplete="off" />)}
      </Form.Item>
      <Form.Item>
        {getFieldDecorator('code', {
          initialValue: '',
          ...constant.VALIDATE_TRIGGER_ONBLUR,
          rules: [
            { required: true, message: '请输入验证码' },
            {
              len: 4,
              message: '请输入四位验证码',
            },
          ],
        })(
          <Input
            size="large"
            placeholder="请输入验证码"
            className={Style['m-code']}
            maxLength={4}
            autoComplete="off"
          />,
        )}
        <a onClick={updateImgCode} className={Style['m-imgCode']}>
          <img src={imgCodeUrl} alt="验证码" />
        </a>
      </Form.Item>
      <Form.Item className={Style['m-passwordOperate']}>
        {getFieldDecorator('remember', {
          valuePropName: 'checked',
          initialValue: keepLoginInfo.remember === undefined ? true : keepLoginInfo.remember,
        })(<Checkbox>记住密码</Checkbox>)}
        <a className={Style['m-forget']} onClick={forget}>
          忘记密码？
        </a>
      </Form.Item>
      <BigButton text="登录" htmlType="submit" className={Style['m-loginBtn']} />
      <div className="f-tac">
        您还可以 <a onClick={register}>立即注册</a>或<a onClick={join}>加入公司</a>
      </div>
    </Form>
  );
};
const WrappedLoginForm = Form.create({ name: 'normal_login' })(LoginForm);
export default connect(({ versionType }) => ({ versionType }))(WrappedLoginForm);
