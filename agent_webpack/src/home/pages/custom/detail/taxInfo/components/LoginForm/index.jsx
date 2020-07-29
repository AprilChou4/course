import React from 'react';
import { Form } from 'antd';
import { connect } from 'nuomi';
import classnames from 'classnames';
import PersonalTax from './PersonalTax'; // 个税扣缴系统的登录方式 #130175
import TaxBureau from './TaxBureau'; //  电子税务局系统的登录方式

const LoginForm = ({ form, isEditing, declarationTypes }) => {
  if (!declarationTypes.length) {
    return null;
  }
  return (
    <dl className={classnames('form-block', { 'from-disabled': !isEditing })}>
      <dt>登录信息</dt>
      <dd>
        <TaxBureau form={form} />
        <PersonalTax form={form} />
      </dd>
    </dl>
  );
};

const mapStateToProps = ({ isEditing, declarationTypes, loginModeForm }) => ({
  isEditing,
  declarationTypes,
  loginModeForm,
});

export default connect(mapStateToProps, null, null, { withRef: true })(
  Form.create({
    onValuesChange(props, changedFields, allFields) {
      const resultForm = {
        ...props.loginModeForm,
        ...allFields,
      };
      props.dispatch({
        type: 'updateState',
        payload: {
          loginModeForm: resultForm,
        },
      });
    },
  })(LoginForm),
);
