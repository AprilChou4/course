// 云记账注册 > 第三步>选择地区
import React from 'react';
import { connect } from 'nuomi';
import { Base64 } from 'js-base64';
import BigButton from '../../BigButton';
import NameAndArea from '../../NameAndArea';
import Style from './style.less';

const DzStepFour = ({ dispatch, registerInfo, selectedCompanyType, form }) => {
  const { validateFields } = form;

  // 立即注册
  const signUp = () => {
    validateFields((err, values) => {
      if (err) {
        return;
      }
      const { area, ...rest } = values;
      const url = selectedCompanyType === 1 ? '$joinCompany' : '$dzRegister';
      dispatch({
        type: url,
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
        isShowCompanyName
        isShowRealName={selectedCompanyType === 1}
        isShowPhoneNum={false}
        isShowArea={selectedCompanyType === 0}
        phoneNum={registerInfo.phoneNum}
        isValidateFirm={selectedCompanyType === 1}
      />
      <BigButton
        className={Style['m-nextBtn']}
        text={selectedCompanyType === 1 ? '申请加入' : '立即注册'}
        onClick={signUp}
      />
    </>
  );
};
export default connect(({ registerInfo, selectedCompanyType }) => ({
  registerInfo,
  selectedCompanyType,
}))(DzStepFour);
