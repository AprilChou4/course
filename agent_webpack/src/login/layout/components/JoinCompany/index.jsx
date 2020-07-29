// 注册通用弹窗
import React from 'react';
import { Modal, Form, Spin } from 'antd';
import { connect } from 'nuomi';
import StepOne from './StepOne';
import StepTwo from './StepTwo';
import SuccessApplyModal from '../SuccessApplyModal';
import Style from './style.less';

const JoinCompany = ({
  title = '加入公司',
  dispatch,
  loadings,
  joinCompanyVisible,
  joinSuccessVisible,
  joinStep,
  joinInfo,
  form,
}) => {
  // 已有账号立即登录
  const login = () => {
    dispatch({
      type: 'updateState',
      payload: {
        loginVisible: true,
        joinCompanyVisible: false,
      },
    });
  };

  // 关闭弹窗
  const onCancel = () => {
    dispatch({
      type: 'updateState',
      payload: {
        joinCompanyVisible: false,
        joinStep: 1,
        joinInfo: {},
        phoneNumInfo: {},
      },
    });
  };

  // 返回上一步
  const prevStep = () => {
    dispatch({
      type: 'updateState',
      payload: {
        joinStep: joinStep - 1,
      },
    });
  };

  // 关闭申请成功提示弹窗
  const closeApplyModal = () => {
    dispatch({
      type: 'updateState',
      payload: {
        joinSuccessVisible: false,
        // 重置
        joinStep: 1,
        joinInfo: {},
        phoneNumInfo: {},
      },
    });
  };
  return (
    <>
      <SuccessApplyModal
        onCancel={closeApplyModal}
        visible={joinSuccessVisible}
        title="加入公司"
        companyName={joinInfo.companyName}
      />
      {joinCompanyVisible && (
        <Modal
          visible={joinCompanyVisible}
          width={598}
          centered
          maskClosable={false}
          destroyOnClose
          className={Style['m-joinCompany']}
          footer={null}
          onCancel={onCancel}
        >
          <Spin spinning={!!loadings.$dzJoinMobileCodeCheck || !!loadings.$joinCompany}>
            <div className={Style['m-title']}>{title}</div>
            <Form>
              {joinStep === 1 && <StepOne form={form} />}

              {joinStep === 2 && <StepTwo form={form} />}
            </Form>
            <div>
              <a onClick={joinStep === 1 ? login : prevStep}>&lt;&lt; 返回上一步</a>
              <span className="f-fr">
                您还可以<a onClick={login}>已有账号立即登录</a>
              </span>
            </div>
          </Spin>
        </Modal>
      )}
    </>
  );
};
export default connect(
  ({ loadings, joinCompanyVisible, joinSuccessVisible, joinStep, joinInfo }) => ({
    loadings,
    joinCompanyVisible,
    joinSuccessVisible,
    joinStep,
    joinInfo,
  }),
)(Form.create()(JoinCompany));
