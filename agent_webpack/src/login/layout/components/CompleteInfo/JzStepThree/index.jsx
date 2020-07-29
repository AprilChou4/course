// 云记账注册 > 第三步>选择地区
import React from 'react';
import { connect } from 'nuomi';
import BigButton from '../../BigButton';
import NameAndArea from '../../NameAndArea';
import Style from './style.less';

const JzStepThree = ({ dispatch, loginInfo, completeInfo, form }) => {
  const { validateFields } = form;
  const { userType, username, phoneNum } = loginInfo;
  // 立即开通>>记账完善信息
  const signUp = () => {
    validateFields((err, values) => {
      if (err) {
        return;
      }
      const { area, ...rest } = values;
      dispatch({
        type: '$jzCompleteInfo',
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
        isShowCompanyName={false}
        isShowRealName
        isShowPhoneNum
        phoneNum={userType === 1 ? username : phoneNum}
        isValidatePhone={false}
        isShowArea
      />
      <BigButton className={Style['m-nextBtn']} text="立即开通" onClick={signUp} />
    </>
  );
};
export default connect(({ loginInfo, completeInfo }) => ({
  loginInfo,
  completeInfo,
}))(JzStepThree);
