// 云记账注册 > 第三步>选择地区
import React from 'react';
import { connect } from 'nuomi';
import { Base64 } from 'js-base64';
import BigButton from '../../BigButton';
import NameAndArea from '../../NameAndArea';
import Style from './style.less';

const JzStepThree = ({ dispatch, registerInfo, form }) => {
  const { validateFields } = form;

  // 立即注册
  const signUp = () => {
    validateFields((err, values) => {
      if (err) {
        return;
      }
      const { area, ...rest } = values;
      dispatch({
        type: '$jzRegister',
        payload: {
          ...registerInfo,
          ...area,
          password: Base64.encode(registerInfo.password),
          rePassword: Base64.encode(registerInfo.rePassword),
          ...rest,
        },
      });
    });
  };

  return (
    <>
      <NameAndArea
        form={form}
        isShowCompanyName={false}
        isShowRealName
        isShowPhoneNum={false}
        isShowArea
        phoneNum={registerInfo.phoneNum}
        isValidateFirm={false}
      />
      <BigButton className={Style['m-nextBtn']} text="立即注册" onClick={signUp} />
    </>
  );
};
export default connect(({ registerInfo }) => ({
  registerInfo,
}))(JzStepThree);
