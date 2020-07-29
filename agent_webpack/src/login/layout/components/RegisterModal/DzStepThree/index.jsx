// 记账注册 > 第一步
import React from 'react';
import { connect } from 'nuomi';
import VertifyCode from '@components/VertifyCode';
import services from '@login/layout/services';
import { DZ_REGISTER_IMAGE_CODE, DZ_JOIN_IMAGE_CODE } from '@login/apis';
import BigButton from '../../BigButton';
import PasswordCheck from '../../PasswordCheck';
import PhoneNum from '../../PhoneNum';
import Style from './style.less';

const JzStepTwo = ({ dispatch, registerInfo, selectedCompanyType, form }) => {
  const { getFieldsError, getFieldsValue, validateFields } = form;

  /**
   * 检验代账注册图片验证码
   * @param {*} code
   */
  const checkImgCode = async (data) => {
    try {
      const url = selectedCompanyType === 1 ? 'dzJoinImageCodeCheck' : 'dzRegisterImageCodeCheck';
      const res = await services[url](data, {
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

  // 发送代账注册短信验证码
  const sendMobileCode = (code) => {
    return new Promise((resolve, reject) => {
      const values = getFieldsValue();
      if (hasErrors(getFieldsError(['phoneNum']))) {
        return false;
      }
      const url = selectedCompanyType === 1 ? '$dzJoinMobileCode' : '$dzRegisterMobileCode';
      dispatch({
        type: url,
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
        type: ['$dzRegisterMobileCodeCheck', '$dzRegisterJoinMobileCodeCheck'][selectedCompanyType],
        payload: values,
      });
      // dispatch({
      //   type: 'updateState',
      //   payload: {
      //     registerStep: 4,
      //     registerInfo: {
      //       ...registerInfo,
      //       ...values,
      //     },
      //   },
      // });
    });
  };

  return (
    <>
      <PhoneNum form={form} isValidatePhone={selectedCompanyType === 0} isWarnHint />
      <VertifyCode
        imgCodeUrl={selectedCompanyType === 1 ? DZ_JOIN_IMAGE_CODE : DZ_REGISTER_IMAGE_CODE}
        isHasImgCode
        checkImgCode={checkImgCode}
        sendMobileCode={sendMobileCode}
        form={form}
      />
      <PasswordCheck form={form} />
      <BigButton className={Style['m-nextBtn']} onClick={nextStep} />
    </>
  );
};
export default connect(({ registerInfo, selectedCompanyType }) => ({
  registerInfo,
  selectedCompanyType,
}))(JzStepTwo);
