// 云记账注册 > 第三步>选择地区
import React from 'react';
import { connect } from 'nuomi';
import BigButton from '../../BigButton';
import NameAndArea from '../../NameAndArea';
import Style from './style.less';

const DzStepFour = ({ dispatch, loginInfo, completeInfo, selectedCompanyType, form }) => {
  const { validateFields } = form;

  // 立即开通 >
  const signUp = () => {
    validateFields((err, values) => {
      if (err) {
        return;
      }
      const { area, ...rest } = values;
      dispatch({
        type: ['$dzCompleteInfo', '$dzCompleteJoinInfo'][selectedCompanyType],
        payload: {
          ...completeInfo,
          ...area,
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
        isValidateFirm={selectedCompanyType === 1}
        isShowTaxNum
        isShowRealName
        isShowPhoneNum
        isWarnHint={false}
        phoneNum={loginInfo.phoneNum}
        isValidatePhone={false}
        isShowArea
      />
      <BigButton className={Style['m-nextBtn']} text="立即开通" onClick={signUp} />
    </>
  );
};
export default connect(({ loginInfo, completeInfo, selectedCompanyType }) => ({
  loginInfo,
  completeInfo,
  selectedCompanyType,
}))(DzStepFour);
