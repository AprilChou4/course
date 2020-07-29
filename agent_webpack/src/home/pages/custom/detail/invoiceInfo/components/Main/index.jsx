import React, { useState, useEffect, useRef } from 'react';
import { Form, Select, Button } from 'antd';
import { connect, router } from 'nuomi';
import postMessageRouter from '@utils/postMessage';
import { InputLimit } from '@components/InputLimit';
import KpForm from '../KpForm';
import BottomBtns from '../../../layout/components/BottomBtns';

import './style.less';

const { Option } = Select;

const Layout = ({ formParams, form, isEditing, verificationCode, dispatch }) => {
  // Kpform的 ref
  const kpFormRef = useRef();
  // 是否展示 办理税盘其他三个字段
  const [isTaxPlatem, setIsTaxPlatem] = useState(false);
  // 是否展示 办理CA证书其他三个字段
  const [isCACertificate, setIsCACertificate] = useState(false);

  useEffect(() => {
    setIsTaxPlatem(formParams.isOpenTaxPlate === 1);
    setIsCACertificate(formParams.isOpenCaCertificate === 1);
  }, [formParams]);

  // 是否办理税盘状态改变
  function onTaxPlateChange(value) {
    setIsTaxPlatem(value === 1);
  }
  // 是否办理CA证书
  function onCACertificateChange(value) {
    setIsCACertificate(value === 1);
  }

  // 提交表单
  function onSubmit() {
    form.validateFields(async (err) => {
      if (err) return;
      // 有验证码先校验验证码
      if (verificationCode && formParams.billingMethod === 1) {
        // 执行开票form的validateMessageCode接口,
        if (kpFormRef.current && kpFormRef.current.ref.current) {
          await kpFormRef.current.ref.current.validateMessageCode();
        }
      }
      await dispatch({
        type: 'updateInvoice',
      });
      form.resetFields();
    });
  }
  // 取消编辑
  function onCancle() {
    const {
      query: { isAlone },
    } = router.location();
    if (isAlone === '1') {
      window.parent.postMessage('close', '*');
    } else {
      postMessageRouter({
        type: 'agentAccount/routerLocation',
        payload: {
          url: '/custom/list/',
        },
      });
    }
  }
  // 编辑
  function onEdit() {
    dispatch({
      type: 'updateState',
      payload: {
        isEditing: true,
      },
    });
  }

  const { getFieldDecorator } = form;
  return (
    <div className="custom-form-wrap">
      <Form>
        {/* <dl className="form-block">
          <dt>基础信息</dt>
          <dd>
            <div className="form-row">
              <Form.Item label="地址电话">
                {getFieldDecorator('address', {
                  initialValue: formParams.address,
                })(
                  <Input
                    placeholder={isEditing ? '请输入地址电话' : '-'}
                    autoComplete="off"
                    disabled={!isEditing}
                  />,
                )}
              </Form.Item>
              <Form.Item label="开户行及账号">
                {getFieldDecorator('bankAccount', {
                  initialValue: formParams.bankAccount,
                })(
                  <Input
                    placeholder={isEditing ? '请输入开户行及账号' : '-'}
                    autoComplete="off"
                    disabled={!isEditing}
                  />,
                )}
              </Form.Item>
            </div>
          </dd>
        </dl> */}
        <dl className="form-block">
          <dt>税盘信息</dt>
          <dd>
            <div className="form-row">
              <Form.Item label="是否办理税盘">
                {getFieldDecorator('isOpenTaxPlate', {
                  initialValue:
                    formParams.isOpenTaxPlate < 0 ? undefined : formParams.isOpenTaxPlate,
                })(
                  <Select
                    placeholder={isEditing ? '请选择' : '-'}
                    disabled={!isEditing}
                    onChange={onTaxPlateChange}
                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                  >
                    <Option value={1}>是</Option>
                    <Option value={0}>否</Option>
                  </Select>,
                )}
              </Form.Item>
              {isTaxPlatem && (
                <Form.Item label="是否托管">
                  {getFieldDecorator('isOpenTaxPlateCustody', {
                    initialValue:
                      formParams.isOpenTaxPlateCustody < 0
                        ? undefined
                        : formParams.isOpenTaxPlateCustody,
                  })(
                    <Select
                      placeholder={isEditing ? '请选择' : '-'}
                      disabled={!isEditing}
                      getPopupContainer={(triggerNode) => triggerNode.parentNode}
                    >
                      <Option value={1}>是</Option>
                      <Option value={0}>否</Option>
                    </Select>,
                  )}
                </Form.Item>
              )}
            </div>
            {isTaxPlatem && (
              <div className="form-row">
                <Form.Item label="开票软件密码">
                  {getFieldDecorator('billingSoftwarePassword', {
                    initialValue: formParams.billingSoftwarePassword || '',
                  })(
                    <InputLimit
                      placeholder={isEditing ? '请输入开票软件密码' : '-'}
                      maxLength={20}
                      autoComplete="off"
                      disabled={!isEditing}
                    />,
                  )}
                </Form.Item>
                <Form.Item label="开票软件口令">
                  {getFieldDecorator('billingSoftwareCommand', {
                    initialValue: formParams.billingSoftwareCommand || '',
                  })(
                    <InputLimit
                      placeholder={isEditing ? '请输入开票软件口令' : '-'}
                      autoComplete="off"
                      maxLength={20}
                      disabled={!isEditing}
                    />,
                  )}
                </Form.Item>
              </div>
            )}
            <div className="form-row">
              <Form.Item label="是否办理CA证书">
                {getFieldDecorator('isOpenCaCertificate', {
                  initialValue:
                    formParams.isOpenCaCertificate < 0 ? undefined : formParams.isOpenCaCertificate,
                })(
                  <Select
                    placeholder={isEditing ? '请选择' : '-'}
                    disabled={!isEditing}
                    onChange={onCACertificateChange}
                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                  >
                    <Option value={1}>是</Option>
                    <Option value={0}>否</Option>
                  </Select>,
                )}
              </Form.Item>
              {isCACertificate && (
                <Form.Item label="是否托管">
                  {getFieldDecorator('isOpenCaCertificateCustody', {
                    initialValue:
                      formParams.isOpenCaCertificateCustody < 0
                        ? undefined
                        : formParams.isOpenCaCertificateCustody,
                  })(
                    <Select
                      placeholder={isEditing ? '请选择' : '-'}
                      disabled={!isEditing}
                      getPopupContainer={(triggerNode) => triggerNode.parentNode}
                    >
                      <Option value={1}>是</Option>
                      <Option value={0}>否</Option>
                    </Select>,
                  )}
                </Form.Item>
              )}
            </div>
            {isCACertificate && (
              <div className="form-row">
                <Form.Item label="CA证书密码">
                  {getFieldDecorator('caCertificatePassword', {
                    initialValue: formParams.caCertificatePassword || '',
                  })(
                    <InputLimit
                      placeholder={isEditing ? '请输入CA证书密码' : '-'}
                      autoComplete="off"
                      maxLength={20}
                      disabled={!isEditing}
                    />,
                  )}
                </Form.Item>
                <Form.Item label="CA证书口令">
                  {getFieldDecorator('caCertificateCommand', {
                    initialValue: formParams.caCertificateCommand || '',
                  })(
                    <InputLimit
                      placeholder={isEditing ? '请输入CA证书口令' : '-'}
                      autoComplete="off"
                      maxLength={20}
                      disabled={!isEditing}
                    />,
                  )}
                </Form.Item>
              </div>
            )}
          </dd>
        </dl>
        {formParams.isInvoiceAgentType ? <KpForm form={form} ref={kpFormRef} /> : null}
        {/* <dl className="form-block">
          <dt>开票限额</dt>
          <dd>
            <div className="form-row" styleName="invoice-limit-row">
              <span styleName="invoice-limit-label required">开票限额：</span>
              <Form.Item label="增值税普通发票" colon={false}>
                {getFieldDecorator('universalTicketLimit', {
                  initialValue: formParams.universalTicketLimit,
                })(
                  <InputNumber
                    placeholder={isEditing ? '请输入限额' : '-'}
                    disabled={!isEditing}
                  />,
                )}
                元
              </Form.Item>
              <Form.Item label="增值税专用发票" colon={false}>
                {getFieldDecorator('specialTicketLimit', {
                  initialValue: formParams.specialTicketLimit,
                })(
                  <InputNumber
                    placeholder={isEditing ? '请输入限额' : '-'}
                    disabled={!isEditing}
                  />,
                )}
                元
              </Form.Item>
              <Form.Item label="增值税电子普通发票" colon={false}>
                {getFieldDecorator('electricTicketLimit', {
                  initialValue: formParams.electricTicketLimit,
                })(
                  <InputNumber
                    placeholder={isEditing ? '请输入限额' : '-'}
                    disabled={!isEditing}
                  />,
                )}
                元
              </Form.Item>
            </div>
          </dd>
        </dl> */}
      </Form>
      <BottomBtns isEditing={isEditing} onCancle={onCancle} onSave={onSubmit} onEdit={onEdit} />
    </div>
  );
};

const mapStateToProps = ({ formParams, isEditing, verificationCode }) => ({
  formParams,
  isEditing,
  verificationCode,
});

export default connect(mapStateToProps)(
  Form.create({
    onValuesChange(props, changedFields, allFields) {
      props.dispatch({
        type: 'updateState',
        payload: {
          formParams: { ...props.formParams, ...allFields },
          isContChange: true,
        },
      });
    },
  })(Layout),
);
