// 注册通用弹窗
import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Spin } from 'antd';
import { connect } from 'nuomi';

import sso from '@login/public/sso';
import RegisterSteps from './RegisterSteps'; // 注册步骤
import ChooseProduct from '../ChooseProduct'; // 选择注册产品>第一步
import JzStepTwo from './JzStepTwo'; // 云记账注册 > 第二步
import JzStepThree from './JzStepThree'; // 云记账注册 > 第三步>选择地区

import DzChooseIsNew from '../DzChooseIsNew'; // 云代账注册 > 第二步 >选择加入公司/创建公司
import DzStepThree from './DzStepThree'; // 云代账注册 > 第三步
import DzStepFour from './DzStepFour'; // 云代账注册 > 第四步>选择地区
import SuccessHint from '../SuccessHint'; // 注册成功页面

import Style from './style.less';

const RegisterModal = ({
  currtPage,
  title = '注册',
  dispatch,
  className,
  form,
  loadings,
  registerStep,
  registerVisible,
  versionType,
  registerInfo,
  selectedCompanyType,
  successReturnInfo,
}) => {
  const [step, setStep] = useState(0);
  const { getFieldDecorator } = form;
  // 点击注册按钮
  const register = () => {
    // 待优化、、和登录代码一致
    let type = 2;
    ['personal', 'agent', 'home'].forEach((item, key) => {
      if (item === currtPage) {
        type = key;
      }
    });
    dispatch({
      type: 'updateState',
      payload: {
        registerVisible: true,
        versionType: type,
      },
    });
  };

  // 关闭弹窗、恢复默认状态
  const onCancel = () => {
    if ((versionType === 0 && registerStep === 4) || (versionType === 1 && registerStep === 5)) {
      sso(successReturnInfo, dispatch);
    }
    dispatch({
      type: 'updateState',
      payload: {
        registerVisible: false,
        registerStep: 1,
        phoneNumInfo: {},
        selectedCompanyType: 2,
      },
    });
  };
  // 获取当前步骤
  useEffect(() => {
    let stepCurrent = 0;
    if (registerStep === 1) {
      stepCurrent = 0;
    } else if (registerStep === 2 || registerStep === 3) {
      stepCurrent = 1;
    } else {
      stepCurrent = 2;
    }
    setStep(stepCurrent);
  }, [registerStep]);

  // 选择记账/代账==> 点击下一步
  const chooseProductNextStep = () => {
    dispatch({
      type: 'updateState',
      payload: {
        registerStep: 2,
      },
    });
  };

  // 代账选择创建公司/加入已有公司==>下一步
  const dzChooseNextStep = () => {
    dispatch({
      type: 'updateState',
      payload: {
        registerStep: 3,
      },
    });
  };

  // 返回上一步
  const prevStep = () => {
    dispatch({
      type: 'updateState',
      payload: {
        registerStep: registerStep - 1,
      },
    });
  };

  // 已有账号立即登录
  const login = () => {
    dispatch({
      type: 'updateState',
      payload: {
        loginVisible: true,
        registerVisible: false,
        registerStep: 1,
      },
    });
  };
  return (
    <>
      <a onClick={register} className={className}>
        免费注册
      </a>
      <Modal
        visible={registerVisible}
        width={598}
        height={480}
        centered
        maskClosable={false}
        className={Style['m-modalWrap']}
        footer={null}
        onCancel={onCancel}
      >
        <Spin
          spinning={
            !!loadings.$jzRegisterMobileCodeCheck ||
            !!loadings.$jzRegister ||
            !!loadings.$dzRegisterMobileCodeCheck ||
            !!loadings.$dzRegisterJoinMobileCodeCheck ||
            !!loadings.$joinCompany ||
            !!loadings.$dzRegister
          }
        >
          <div className={Style['m-title']}>{title}</div>
          <RegisterSteps current={step} />
          <Form>
            <Form.Item>
              {getFieldDecorator('versionType', {
                initialValue: versionType,
              })(<Input type="hidden" />)}
            </Form.Item>
            {registerStep === 1 && <ChooseProduct nextStepCallback={chooseProductNextStep} />}
            {versionType === 0 ? (
              <>
                {registerStep === 2 && <JzStepTwo form={form} />}
                {registerStep === 3 && <JzStepThree form={form} />}
                {registerStep === 4 && <SuccessHint title="注册成功" upInfo={registerInfo} />}
              </>
            ) : (
              <>
                {registerStep === 2 && (
                  <DzChooseIsNew form={form} nextStepCallback={dzChooseNextStep} />
                )}
                {registerStep === 3 && <DzStepThree form={form} />}
                {registerStep === 4 && <DzStepFour form={form} />}
                {registerStep === 5 &&
                  (selectedCompanyType === 0 ? (
                    <SuccessHint title="注册成功" upInfo={registerInfo} />
                  ) : (
                    <SuccessHint
                      title="申请成功"
                      smallTitle="请等待公司管理员审批"
                      upInfo={registerInfo}
                    />
                  ))}
              </>
            )}
          </Form>
          {((versionType === 0 && ![1, 4].includes(registerStep)) ||
            (versionType === 1 && ![1, 5].includes(registerStep))) && (
            <div>
              <a onClick={prevStep}>&lt;&lt; 返回上一步</a>
              <span className="f-fr">
                您还可以<a onClick={login}>已有账号立即登录</a>
              </span>
            </div>
          )}
        </Spin>
      </Modal>
    </>
  );
};
RegisterModal.defaultProps = {
  // 当前定位的tab页面
  currtPage: 'home',
};
export default connect(
  ({
    loadings,
    registerVisible,
    registerStep,
    versionType,
    registerInfo,
    selectedCompanyType,
    successReturnInfo,
  }) => ({
    loadings,
    registerVisible,
    registerStep,
    versionType,
    registerInfo,
    selectedCompanyType,
    successReturnInfo,
  }),
)(Form.create()(RegisterModal));
