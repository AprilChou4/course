import React, { useImperativeHandle } from 'react';
import { connect } from 'nuomi';
import { Radio, Form, Input, Button, Popover, message } from 'antd';
import pubData from 'data';
import ShowConfirm from '@components/ShowConfirm';
import { get, postMessage as postMessageRouter } from '@utils';
import CreditCodeModal from './CreditCodeModal';
import '../Main/style.less';
import './style.less';

const KpForm = (
  {
    form,
    formParams,
    isShowAgentRelation,
    agentStatus,
    verificationCode,
    initialBillingMethod,
    loadings,
    isEditing,
    dispatch,
  },
  ref,
) => {
  useImperativeHandle(ref, () => ({
    validateMessageCode, // eslint-disable-line
  }));
  // 处理错误弹窗
  const processError = ({ errMsg, errCode }) => {
    // 客户没有统一信用码902
    if (errCode === 902) {
      dispatch({
        type: 'updateState',
        payload: {
          isShowCreditCodeModal: true,
        },
      });
      return;
    }
    // 不具备纸电一体的资质 / 客户不存在代开的代理关系
    if (errCode === 910 || errCode === 911) {
      ShowConfirm({
        type: 'warning',
        width: 335,
        title: errMsg,
        onOk() {
          form.setFieldsValue({
            billingMethod: initialBillingMethod,
          });
        },
      });
      return;
    }
    // 获取验证码过频繁904
    if (errCode === 904) {
      message.warn(errMsg);
      return;
    }
    // 管理员需完善企业信息900
    if (errCode === 900) {
      ShowConfirm({
        width: 335,
        title: errMsg,
        okText: '去认证',
        onOk() {
          postMessageRouter({
            type: 'agentAccount/routerLocation',
            payload: {
              url: '/companyInfo',
            },
          });
        },
      });
      return;
    }
    // 企业信息发生变化907 或 验证码失效908
    if (errCode === 907 || errCode === 908) {
      ShowConfirm({
        width: 290,
        title: errMsg,
        okText: '重新验证',
        cancelText: '终止验证',
        onOk() {
          dispatch({
            type: 'updateState',
            payload: {
              verificationCode: '',
            },
          });
          // eslint-disable-next-line no-use-before-define
          handleSendCode();
        },
        onCancel() {
          dispatch({
            type: 'updateState',
            payload: {
              verificationCode: '',
            },
          });
        },
      });
      return;
    }
    // 验证码错误，应当清空输入框
    if (errCode === 906) {
      ShowConfirm({
        type: 'warning',
        className: 'invoice-kpform-modal',
        title: errMsg,
        onOk() {
          dispatch({
            type: 'updateState',
            payload: {
              verificationCode: '',
            },
          });
        },
      });
      return;
    }
    ShowConfirm({
      type: 'warning',
      className: 'invoice-kpform-modal',
      title: errMsg,
    });
  };

  // 切换开票方式为纸电一体的时候需要校验
  const validateZdyt = async () => {
    const result = await dispatch({
      type: 'validateStatus',
    });
    if (!result) return;
    // 处理错误弹窗
    processError(result);
  };

  // 开票方式更换
  const handleChange = async (e) => {
    // 纸电一体要校验（补充税号、资质检验）
    if (e.target.value === 1) {
      validateZdyt();
    } else {
      dispatch({
        type: 'updateState',
        payload: {
          isShowAgentRelation: false,
          verificationCode: '',
        },
      });
    }
  };

  // 点击发送验证码
  async function handleSendCode() {
    const result = await dispatch({
      type: '$sendMessageCode',
      payload: {
        isShowCreditCodeModal: true,
      },
    });
    if (!result) return;
    // 处理错误弹窗
    processError(result);
  }

  // 验证码输入
  const handleInputChange = (e) => {
    dispatch({
      type: 'updateState',
      payload: {
        verificationCode: e.target.value,
      },
    });
  };

  // 校验验证码
  async function validateMessageCode() {
    const result = await dispatch({
      type: 'validateMessageCode',
    });
    if (result) {
      // 处理错误弹窗
      processError(result);
    }
  }

  // 关闭弹窗回调，如果是切换开票方式的时候弹出的，关闭时，需要将开票方式复位
  const handleModalClose = () => {
    if (!isShowAgentRelation) {
      form.setFieldsValue({ billingMethod: initialBillingMethod });
    }
  };

  // 弹窗保存成功
  const handleModalSave = () => {
    // 发送验证码的保存税号需要直接请求验证码
    if (isShowAgentRelation) {
      handleSendCode();
    } else {
      // 切换开票方式的保存税号需要再一次请求验证资质
      validateZdyt();
    }
  };

  // 根据地区获取开票方式选项，大连存在51开票
  const company = pubData.get('userInfo_company');
  const areaCode = get(company, 'areaCode');
  const kpRadios = ['易代开', ' 纸电一体'];
  if (areaCode.includes('2102')) {
    kpRadios.push('51开票');
  }

  const { getFieldDecorator } = form;
  return (
    <>
      <dl className="form-block">
        <dt>开票方式</dt>
        <dd>
          <div className="form-row">
            <Form.Item label="开票方式">
              {getFieldDecorator('billingMethod', {
                initialValue: formParams.billingMethod,
                rules: [{ required: true, message: '请选择开票方式' }],
              })(
                <Radio.Group onChange={handleChange} disabled={!isEditing}>
                  {kpRadios.map((item, idx) => (
                    <Radio value={idx} style={{ marginRight: 20 }} key={item}>
                      {item}
                    </Radio>
                  ))}
                </Radio.Group>,
              )}
            </Form.Item>
          </div>
        </dd>
      </dl>
      {isShowAgentRelation && (
        <dl className="form-block">
          <dt>
            代理关系真实性验证
            <Popover placement="right" content="亲，完成真实性校验后方可正常保用纸电一体功能！">
              <i className="iconfont" styleName="help-icon">
                &#xeb10;
              </i>
            </Popover>
          </dt>
          <dd>
            <div className="form-row">
              <div styleName="invoice-agent-label">代理关系：</div>
              <div styleName="invoice-agent-control-wrap">
                {agentStatus === 2 ? (
                  <div styleName="validated">已验证</div>
                ) : (
                  <>
                    <Input
                      placeholder="请输入验证码"
                      autoComplete="off"
                      value={verificationCode}
                      onChange={handleInputChange}
                      disabled={!isEditing || agentStatus !== 1}
                    />
                    <Button
                      onClick={handleSendCode}
                      disabled={!isEditing || agentStatus === 1}
                      loading={loadings.$sendMessageCode}
                    >
                      发送验证码
                    </Button>
                  </>
                )}
              </div>
            </div>
          </dd>
        </dl>
      )}
      <CreditCodeModal onClose={handleModalClose} onSave={handleModalSave} />
    </>
  );
};

export default connect(
  ({
    formParams,
    initialBillingMethod,
    agentStatus,
    isShowAgentRelation,
    loadings,
    verificationCode,
    isEditing,
  }) => ({
    formParams,
    agentStatus,
    isShowAgentRelation,
    verificationCode,
    initialBillingMethod,
    loadings,
    isEditing,
  }),
  null,
  null,
  { withRef: true },
)(React.forwardRef(KpForm));
