// 记账注册 > 第一步
import React from 'react';
import { connect } from 'nuomi';
import VertifyCode from '@components/VertifyCode';
import services from '@login/layout/services';
import { DZ_COMPLETE_IMAGE_CODE, DZ_JOIN_IMAGE_CODE } from '@login/apis';
import BigButton from '../../BigButton';
import PhoneNum from '../../PhoneNum';
import TaxNum from '../../TaxNum';
import Style from './style.less';

const JzStepTwo = ({ dispatch, loginInfo, completeInfo, selectedCompanyType, form }) => {
  const { getFieldsValue, getFieldsError, validateFields } = form;
  let imgCodeInfo = {};
  if (selectedCompanyType === 0) {
    imgCodeInfo = {
      imgCodeUrl: DZ_COMPLETE_IMAGE_CODE,
      mobileCodeUrl: '$dzCompleteMobileCode',
    };
  } else {
    imgCodeInfo = {
      imgCodeUrl: DZ_JOIN_IMAGE_CODE,
      mobileCodeUrl: '$dzJoinMobileCode',
    };
  }
  /**
   * 检验代账完善信息注册图片验证码(0)/ 检验代账加入公司图片验证码(1)
   * @param {*} code
   */
  const checkImgCode = async (data) => {
    const url = ['dzCompleteImageCodeCheck', 'dzJoinImageCodeCheck'][selectedCompanyType];
    try {
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

  // 发送代账完善信息注册短信验证码
  const sendMobileCode = (code) => {
    return new Promise((resolve, reject) => {
      const values = getFieldsValue();
      if (hasErrors(getFieldsError(['phoneNum']))) {
        return false;
      }
      dispatch({
        type: imgCodeInfo.mobileCodeUrl,
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
        type: ['$dzCompleteMobileCodeCheck', '$dzCompleteJoinMobileCodeCheck'][selectedCompanyType],
        payload: values,
      });
      // dispatch({
      //   type: 'updateState',
      //   payload: {
      //     completeStep: 4,
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
      <PhoneNum
        form={form}
        disabled
        isValidatePhone={false}
        isWarnHint={false}
        defaultValue={loginInfo.phoneNum}
      />
      <VertifyCode
        imgCodeUrl={imgCodeInfo.imgCodeUrl}
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
export default connect(({ loginInfo, selectedCompanyType }) => ({
  loginInfo,
  selectedCompanyType,
}))(JzStepTwo);
