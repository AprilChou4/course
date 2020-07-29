// 完善信息弹窗
import React from 'react';
import { Modal, Form, Input, Spin } from 'antd';
import { connect } from 'nuomi';

import ChooseProduct from '../ChooseProduct'; // 选择注册产品>第一步
import JzStepTwo from './JzStepTwo'; // 记账完善信息 > 第二步
import JzStepThree from './JzStepThree'; // 记账完善信息 > 第三步>选择地区

import DzChooseIsNew from '../DzChooseIsNew'; // 云代账完善信息 > 第二步 >选择加入公司/创建公司
import DzStepThree from './DzStepThree'; // 云代账完善信息 > 第三步
import DzStepFour from './DzStepFour'; // 云代账完善信息 > 第四步>选择地区
import SuccessHint from '../SuccessHint'; // 注册成功页面
import SuccessApplyModal from '../SuccessApplyModal'; // 申请成功页面

import Style from './style.less';

const CompleteInfo = ({
  title = '立即开通',
  dispatch,
  loadings,
  form,
  completeInfo,
  completeStep,
  completeInfoVisible,
  versionType,
  selectedCompanyType,
  applySuccessVisible,
}) => {
  const { getFieldDecorator } = form;
  // 关闭完善信息弹窗
  const onCancel = () => {
    dispatch({
      type: 'updateState',
      payload: {
        completeInfoVisible: false,
        completeStep: 1,
        completeInfo: {},
        selectedCompanyType: 2,
      },
    });
  };

  // 选择记账/代账==> 点击下一步
  const chooseProductNextStep = () => {
    dispatch({
      type: 'updateState',
      payload: {
        completeStep: 2,
      },
    });
  };

  // 代账选择创建公司/加入已有公司==>下一步
  const dzChooseNextStep = () => {
    dispatch({
      type: 'updateState',
      payload: {
        completeStep: 3,
      },
    });
  };

  // 关闭申请成功提示弹窗
  const closeApplyModal = () => {
    dispatch({
      type: 'updateState',
      payload: {
        applySuccessVisible: false,
        // 重置信息
        completeStep: 1,
        completeInfo: {},
      },
    });
  };

  return (
    <>
      {applySuccessVisible && (
        <SuccessApplyModal
          companyName={completeInfo.companyName}
          title="立即开通"
          visible={applySuccessVisible}
          onCancel={closeApplyModal}
        />
      )}
      <Modal
        visible={completeInfoVisible}
        width={598}
        height={480}
        centered
        maskClosable={false}
        className={Style['m-completeModal']}
        footer={null}
        onCancel={onCancel}
      >
        <Spin
          spinning={
            !!loadings.$jzCompleteMobileCodeCheck ||
            !!loadings.$jzCompleteInfo ||
            !!loadings.$dzCompleteMobileCode ||
            !!loadings.$dzJoinMobileCode ||
            !!loadings.$dzCompleteInfo ||
            !!loadings.$dzCompleteJoinInfo
          }
        >
          <div className={Style['m-title']}>{title}</div>
          <Form>
            {getFieldDecorator('versionType', {
              initialValue: versionType,
            })(<Input type="hidden" />)}
            {completeStep === 1 && <ChooseProduct nextStepCallback={chooseProductNextStep} />}
            {versionType === 0 ? (
              <>
                {completeStep === 2 && <JzStepTwo form={form} />}
                {completeStep === 3 && <JzStepThree form={form} />}
                {completeStep === 4 && <SuccessHint title="开通成功" upInfo={completeInfo} />}
              </>
            ) : (
              <>
                {completeStep === 2 && (
                  <DzChooseIsNew form={form} nextStepCallback={dzChooseNextStep} />
                )}
                {completeStep === 3 && <DzStepThree form={form} />}
                {completeStep === 4 && <DzStepFour form={form} />}
                {completeStep === 5 && selectedCompanyType === 0 && (
                  <SuccessHint title="开通成功" upInfo={completeInfo} />
                )}
              </>
            )}
          </Form>
        </Spin>
      </Modal>
    </>
  );
};
export default connect(
  ({
    loadings,
    completeInfoVisible,
    completeStep,
    versionType,
    selectedCompanyType,
    applySuccessVisible,
    completeInfo,
  }) => ({
    loadings,
    completeInfoVisible,
    completeStep,
    versionType,
    selectedCompanyType,
    applySuccessVisible,
    completeInfo,
  }),
)(Form.create()(CompleteInfo));
