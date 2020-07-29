// 加入公司 > 第一步
import React from 'react';
import { connect } from 'nuomi';
import BigButton from '../../BigButton';
import NameAndArea from '../../NameAndArea';
import Style from './style.less';

const StepTwo = ({ dispatch, joinInfo, form }) => {
  const { validateFields } = form;

  // 申请加入
  const applyJoin = () => {
    validateFields((err, values) => {
      if (err) {
        return;
      }
      dispatch({
        type: '$joinCompany',
        payload: {
          ...joinInfo,
          ...values,
        },
      });
    });
  };
  return (
    <>
      <NameAndArea
        form={form}
        isShowCompanyName
        isShowRealName
        isShowPhoneNum={false}
        phoneNum={joinInfo.phoneNum}
        isShowArea={false}
      />
      <BigButton className={Style['m-nextBtn']} text="申请加入" onClick={applyJoin} />
    </>
  );
};
export default connect(({ joinInfo }) => ({
  joinInfo,
}))(StepTwo);
