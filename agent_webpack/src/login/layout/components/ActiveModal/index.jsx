// 激活弹窗
import React, { useState } from 'react';
import { Modal, Form, Input, Spin } from 'antd';
import { connect } from 'nuomi';
import VertifyCode from '@components/VertifyCode';
import { DZ_ACTIVE_IMAGE_CODE } from '@login/apis';
import services from '@login/layout/services';
import UpdatePassword from './UpdatePassword'; // 修改密码
import Style from './style.less';

const ActiveModal = ({
  dispatch,
  loadings,
  activeCompanyVisible,
  loginInfo,
  selectedCompanyInfo,
  form,
}) => {
  const { getFieldDecorator, getFieldsError, getFieldsValue, validateFields } = form;
  const [visible, setVisible] = useState(false); // 修改密码弹窗是否显示
  const [mobileCode, setMobileCode] = useState(''); // 激活验证码
  // 点击激活
  const onOk = () => {
    validateFields((err, values) => {
      if (err) {
        return;
      }
      dispatch({
        type: '$dzActiveMobileCodeCheck',
        payload: {
          phoneNum: loginInfo.phoneNum,
          code: values.code,
        },
      }).then((res) => {
        if (res && res.status === 200) {
          dispatch({
            type: '$activateCompany',
            payload: {
              companyName: selectedCompanyInfo.companyName,
              companyId: selectedCompanyInfo.companyId,
              phoneNum: loginInfo.phoneNum,
              ...values,
              setVisible,
              setMobileCode,
            },
          });
        }
      });
    });
  };

  // 关闭弹窗
  const onCancel = () => {
    dispatch({
      type: 'updateState',
      payload: {
        activeCompanyVisible: false,
        selectedCompanyInfo: {},
        loginInfo: {},
      },
    });
  };

  // 检验代账激活公司获取图片验证码
  const checkImgCode = async (data) => {
    try {
      const res = await services.dzActiveImageCodeCheck(data, {
        returnAll: true,
      });
      return res;
    } catch (res) {
      return res;
    }
  };

  const hasErrors = (fieldsError) => {
    return Object.keys(fieldsError).some((field) => fieldsError[field]);
  };

  // 发送代账激活公司短信验证码
  const sendMobileCode = (code) => {
    return new Promise((resolve, reject) => {
      const values = getFieldsValue();
      if (hasErrors(getFieldsError(['phoneNum']))) {
        return false;
      }
      // 单点登录的时候从当前数据获取phoneNum,logininfo获取不到
      dispatch({
        type: '$dzActiveMobileCode',
        payload: {
          ...values,
          phoneNum: loginInfo.phoneNum || selectedCompanyInfo.phoneNum,
          code,
        },
      }).then((res) => {
        resolve(res);
      });
    });
  };
  return (
    <>
      <UpdatePassword visible={visible} setVisible={setVisible} code={mobileCode} />
      <Modal
        visible={activeCompanyVisible}
        title="激活"
        width={474}
        centered
        maskClosable={false}
        className={Style['m-activeModal']}
        okText="激活"
        onOk={onOk}
        onCancel={onCancel}
      >
        <Spin spinning={!!loadings.$dzActiveMobileCodeCheck || !!loadings.$activateCompany}>
          <div className={Style['m-hint']}>当前企业尚未激活，请填写验证码进行激活</div>
          <Form>
            <Form.Item className="f-dn">
              {getFieldDecorator('phoneNum', {
                initialValue: loginInfo.phoneNum,
              })(
                <Input
                  placeholder="请输入手机号"
                  size="large"
                  autoComplete="off"
                  prefix={<span>手机号</span>}
                />,
              )}
            </Form.Item>
            <VertifyCode
              isHasImgCode
              imgCodeUrl={DZ_ACTIVE_IMAGE_CODE}
              checkImgCode={checkImgCode}
              sendMobileCode={sendMobileCode}
              isNeedCheckMobile={false}
              form={form}
            />
          </Form>
        </Spin>
      </Modal>
    </>
  );
};
export default connect(({ loadings, activeCompanyVisible, loginInfo, selectedCompanyInfo }) => ({
  loadings,
  activeCompanyVisible,
  loginInfo,
  selectedCompanyInfo,
}))(Form.create()(ActiveModal));
