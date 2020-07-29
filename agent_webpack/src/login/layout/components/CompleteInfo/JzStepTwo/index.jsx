// 记账完善信息 > 第二步
import React from 'react';
import { connect } from 'nuomi';
import VertifyCode from '@components/VertifyCode';
import services from '@login/layout/services';
import { JZ_COMPLETE_IMAGE_CODE } from '@login/apis';
import BigButton from '../../BigButton';
import PhoneNum from '../../PhoneNum';
import TaxNum from '../../TaxNum';
import Style from './style.less';

const JzStepTwo = ({ dispatch, loginInfo, completeInfo, form }) => {
  const { getFieldsError, getFieldsValue, validateFields } = form;
  /**
   * 检验记账完善图片验证码
   * @param {*} code
   */
  const checkImgCode = async (data) => {
    try {
      const res = await services.jzCompleteImageCodeCheck(data, {
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

  // 发送记账完善短信验证码
  const sendMobileCode = (code) => {
    return new Promise((resolve, reject) => {
      const values = getFieldsValue();
      if (hasErrors(getFieldsError(['phoneNum']))) {
        return false;
      }
      dispatch({
        type: '$jzCompleteMobileCode',
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
        type: '$jzCompleteMobileCodeCheck',
        payload: values,
      });
      // dispatch({
      //   type: 'updateState',
      //   payload: {
      //     completeStep: 3,
      //     completeInfo: {
      //       ...completeInfo,
      //       ...values,
      //     },
      //   },
      // });
    });
  };
  return (
    <>
      <TaxNum form={form} phoneNum={loginInfo.username} disabled />
      <PhoneNum form={form} disabled isValidatePhone={false} defaultValue={loginInfo.phoneNum} />
      <VertifyCode
        imgCodeUrl={JZ_COMPLETE_IMAGE_CODE}
        isHasImgCode
        checkImgCode={checkImgCode}
        sendMobileCode={sendMobileCode}
        isNeedCheckMobile={false}
        form={form}
      />
      <BigButton className={Style['m-nextBtn']} onClick={nextStep} />
    </>
  );
};
export default connect(({ loginInfo, completeInfo }) => ({
  loginInfo,
  completeInfo,
}))(JzStepTwo);
