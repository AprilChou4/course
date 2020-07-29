// 记账注册 > 第一步
import React from 'react';
import { connect } from 'nuomi';
import VertifyCode from '@components/VertifyCode';
import services from '@login/layout/services';
import { JZ_REGISTER_IMAGE_CODE } from '@login/apis';
import BigButton from '../../BigButton';
import PasswordCheck from '../../PasswordCheck';
import PhoneNum from '../../PhoneNum';
import Style from './style.less';

const JzStepTwo = ({ dispatch, form }) => {
  const { getFieldsError, getFieldsValue, validateFields } = form;

  /**
   * 检验记账注册公司图片验证码
   * @param {*} code
   */
  const checkImgCode = async (data) => {
    try {
      const res = await services.jzRegisterImageCodeCheck(data, {
        returnAll: true,
      });
      return res;
    } catch (res) {
      return res;
    }
  };

  const hasErrors = (fieldsError) => {
    return Object.keys(fieldsError).some((field) => fieldsError[field]);
  };

  // 发送记账账加入公司短信验证码
  const sendMobileCode = (code) => {
    return new Promise((resolve, reject) => {
      const values = getFieldsValue();
      // validateFields(['phoneNum'], (err, values) => {
      //   if (!err) {
      if (hasErrors(getFieldsError(['phoneNum']))) {
        return false;
      }
      dispatch({
        type: '$jzRegisterMobileCode',
        payload: {
          ...values,
          code,
        },
      }).then((res) => {
        resolve(res);
      });
    });
  };

  // 下一步
  const nextStep = () => {
    validateFields((err, values) => {
      if (err) {
        return;
      }
      dispatch({
        type: '$jzRegisterMobileCodeCheck',
        payload: values,
      });
    });
  };

  return (
    <>
      <PhoneNum form={form} isValidatePhone />
      <VertifyCode
        imgCodeUrl={JZ_REGISTER_IMAGE_CODE}
        isHasImgCode
        checkImgCode={checkImgCode}
        // checkMobile={checkMobile}
        sendMobileCode={sendMobileCode}
        form={form}
      />
      <PasswordCheck form={form} />
      <BigButton className={Style['m-nextBtn']} onClick={nextStep} />
    </>
  );
};
export default connect()(JzStepTwo);
