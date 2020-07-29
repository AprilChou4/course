// 加入公司 > 第一步
import React from 'react';
import { connect } from 'nuomi';
import VertifyCode from '@components/VertifyCode';
import services from '@login/layout/services';
import { DZ_JOIN_IMAGE_CODE } from '@login/apis';
import BigButton from '../../BigButton';
import PasswordCheck from '../../PasswordCheck';
import PhoneNum from '../../PhoneNum';
import Style from './style.less';

const StepOne = ({ dispatch, joinInfo, form }) => {
  const { getFieldsError, getFieldsValue, validateFields } = form;

  // 检验代账激活公司获取图片验证码
  const checkImgCode = async (data) => {
    try {
      const res = await services.dzJoinImageCodeCheck(data, {
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

  // 发送代账加入公司短信验证码
  const sendMobileCode = (code) => {
    return new Promise((resolve, reject) => {
      const values = getFieldsValue();
      if (hasErrors(getFieldsError(['phoneNum']))) {
        return false;
      }
      dispatch({
        type: '$dzJoinMobileCode',
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
        type: '$dzJoinMobileCodeCheck',
        payload: values,
      });
      // dispatch({
      //   type: 'updateState',
      //   payload: {
      //     joinStep: 2,
      //     joinInfo: {
      //       ...joinInfo,
      //       ...values,
      //     },
      //   },
      // });
    });
  };

  return (
    <>
      <PhoneNum form={form} isValidatePhone={false} isWarnHint />
      <VertifyCode
        imgCodeUrl={DZ_JOIN_IMAGE_CODE}
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
export default connect(({ joinInfo }) => ({
  joinInfo,
}))(StepOne);
