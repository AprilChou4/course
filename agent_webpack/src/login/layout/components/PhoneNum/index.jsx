//  手机号码
import React, { useState, useEffect } from 'react';
import { Form, Input } from 'antd';
import { connect } from 'nuomi';
import WarnHint from '@components/WarnHint';
import services from '@login/layout/services';
import { constant } from '@public/script';

import Style from './style.less';

const FormItem = Form.Item;
const PhoneNum = ({
  isValidatePhone,
  isWarnHint,
  defaultValue = '',
  dispatch,
  form,
  className,
  versionType,
  selectedCompanyType,
  phoneNumInfo,
  ...rest
}) => {
  const { getFieldDecorator, setFieldsValue } = form;
  // 诺诺网用户且未注册记账代账提示信息
  const [nuonuoTip, setNuonuoTip] = useState('');

  // 修改默认手机号
  useEffect(() => {
    setFieldsValue({
      phoneNum: defaultValue,
    });
  }, [defaultValue, setFieldsValue]);

  // 获取提示信息
  const getHintInfo = (data) => {
    const { registerNuonuo, dzManage, registerDz, registerJz } = data;
    // 立即开通云记账
    const openJz = () => {
      dispatch({
        type: 'updateState',
        payload: {
          registerStep: 1,
          versionType: 0,
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
        },
      });
    };
    // 立即登录
    const login = () => {
      dispatch({
        type: 'updateState',
        payload: {
          loginVisible: true,
          registerVisible: false,
        },
      });
    };
    return (
      <>
        {versionType === 1 && dzManage && !registerJz && (
          <p>
            当前手机号已开通云代账，不支持重复开通<a onClick={openJz}>立即开通云记账</a>
          </p>
        )}
        {versionType === 0 && registerJz && !dzManage && (
          <p>
            当前手机号已开通云记账，不支持重复开通<a onClick={openDz}>立即开通云代账</a>
          </p>
        )}
        {dzManage && registerJz && (
          <p>
            当前手机号已开通{versionType === 0 ? '云记账' : '云代账'}，不支持重复开通
            <a onClick={login}>立即登录</a>
          </p>
        )}
      </>
    );
  };

  // 检验手机号当前状态
  const validatorPhone = async (rule, value, callback) => {
    if (!constant.REGEX.mobile.test(value)) {
      setNuonuoTip('');
      return false;
    }
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

    const { registerNuonuo, dzManage, registerJz } = mobileData;
    const info = (isValidatePhone && getHintInfo(mobileData)) || '';
    let hint = ''; // 手机号码提示信息
    // 失去焦点时校验公司名称或者单位序列号不是云代账中的公司
    // 记账
    if (versionType === 0 || versionType === 2) {
      // 首页和记账
      if (registerJz && isValidatePhone) {
        info && callback(info);
        setNuonuoTip('');
      } else if (registerNuonuo) {
        hint =
          selectedCompanyType === 1
            ? '当前手机号已注册诺诺网账号，点击下面按钮立即加入公司'
            : '当前手机号已注册诺诺网账号，点击下一步立即开通云记账';
        setNuonuoTip(hint);
      } else {
        setNuonuoTip('');
      }
    } else if (selectedCompanyType === 0) {
      // 代账创建公司
      if (dzManage && isValidatePhone) {
        info && callback(info);
        setNuonuoTip('');
      } else if (registerNuonuo) {
        hint = '当前手机号已注册诺诺网账号，点击下一步立即开通云代账';
        setNuonuoTip(hint);
      } else {
        setNuonuoTip('');
      }
    } else if (selectedCompanyType === 1) {
      // 代账加入公司
      if (registerNuonuo) {
        hint = '当前手机号已注册诺诺网账号，点击下一步立即开通云代账';
        setNuonuoTip(hint);
      } else {
        setNuonuoTip('');
      }
    } else {
      setNuonuoTip('');
    }
  };
  return (
    <div className={`${Style['m-phoneNum']} ${className || ''}`}>
      <FormItem hasFeedback>
        {getFieldDecorator('phoneNum', {
          initialValue: defaultValue,
          ...constant.VALIDATE_TRIGGER_ONBLUR,
          rules: [
            {
              required: true,
              message: '请输入手机号',
            },
            {
              pattern: constant.REGEX.mobile,
              message: '手机号码格式错误',
            },
            // isValidatePhone && {
            //   validator: validatorPhone,
            // },
            { validator: validatorPhone },
          ],
        })(
          <Input
            placeholder="请输入手机号"
            size="large"
            autoComplete="off"
            prefix={<span>手机号</span>}
            {...rest}
          />,
        )}
      </FormItem>
      {nuonuoTip && isWarnHint && <WarnHint text={nuonuoTip} className={Style['m-hint']} />}
    </div>
  );
};
PhoneNum.defaultProps = {
  // 默认值
  defaultValue: '',
  // 是否需要验证手机号码
  isValidatePhone: true,
  // 是否需要WarnHint  isValidatePhone为true则不显示warnHint
  isWarnHint: true,
};
export default connect(({ phoneNumInfo, versionType, selectedCompanyType }) => ({
  phoneNumInfo,
  versionType,
  selectedCompanyType,
}))(PhoneNum);
