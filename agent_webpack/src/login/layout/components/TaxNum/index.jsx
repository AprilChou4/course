// 税号
import React, { useEffect, useState } from 'react';
import { Form, Input } from 'antd';
import { connect } from 'nuomi';
import { constant } from '@public/script';

import Style from './style.less';

const FormItem = Form.Item;
const TaxNum = ({ dispatch, form, phoneNum, className, ...rest }) => {
  const { getFieldDecorator, setFieldsValue } = form;
  const [userInfoByPhone, setUserInfoByPhone] = useState({}); // 根据手机或税号获取的用户信息
  const { username, userType } = userInfoByPhone;

  // 修改默认手机号
  useEffect(() => {
    // 根据手机号获取获取诺诺用户信息
    dispatch({
      type: '$getUserInfoByPhone',
      payload: {
        phoneNum,
      },
    }).then((res) => {
      // res = {
      //   areaCode: '',
      //   phoneNum: '13244441117',
      //   realName: '13244441117',
      //   remoteId: '011be6cfaba840b2b52cafea5bb1c299',
      //   userId: '',
      //   userType: 1,
      //   username: 'nuonuo11179u',
      // };
      setUserInfoByPhone(res);
      setFieldsValue({
        username: res.username,
      });
    });
  }, [dispatch, phoneNum, setFieldsValue]);
  return (
    <>
      {userType === 1 && (
        <>
          {getFieldDecorator('userType', {
            initialValue: userType,
          })(<Input type="hidden" />)}
          <FormItem hasFeedback className={`${Style['m-taxNum']} ${className || ''}`}>
            {getFieldDecorator('username', {
              initialValue: username,
            })(
              <Input
                placeholder="请输入税号"
                size="large"
                autoComplete="off"
                prefix={<span>税号</span>}
                {...rest}
              />,
            )}
          </FormItem>
        </>
      )}
    </>
  );
};
TaxNum.defaultProps = {
  // 默认值
  form: {},
  // 手机号码,用于获取用户信息
  phoneNum: '',
};
export default connect()(TaxNum);
