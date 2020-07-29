import React, { useRef } from 'react';
import { Form, Button } from 'antd';
import { connect, router } from 'nuomi';
import postMessageRouter from '@utils/postMessage';
import classnames from 'classnames';
import { ShowConfirm } from '@components';
import BaseFrom from '../BaseForm';
import Commissioner from '../Commissioner';
import LoginForm from '../LoginForm';
// import AgentForm from '../AgentForm';
import FinanciaForm from '../FinanciaForm';
import TaxCategoryForm from '../TaxCategoryForm';
import { getAdditionalIds, TAX_MAP } from '../TaxCategoryForm/util';
import BottomBtns from '../../../layout/components/BottomBtns';

import './style.less';

const Layout = ({ form, isEditing, areaName, formTaxList, isNationalTicket, dispatch }) => {
  // #129516
  const { cszs: fromCszs } = router.location().query;
  // 税种信息表单ref
  const taxCategoryRef = useRef();
  // 登录方式表单ref
  const loginModeRef = useRef();
  // 提交表单
  async function onSubmit() {
    await dispatch({
      type: 'updateTax',
    });
    const childTaxCategoryRef = taxCategoryRef.current.ref || {};
    const childLoginModeRef = loginModeRef.current.ref || {};
    form.resetFields();
    childTaxCategoryRef.current && childTaxCategoryRef.current.resetFields();
    childLoginModeRef.current && childLoginModeRef.current.resetFields();
  }
  // 提交表单前
  function beforeSubmit() {
    const childLoginModeRef = loginModeRef.current.ref || {};
    childLoginModeRef.current &&
      childLoginModeRef.current.validateFields((err) => {
        if (!err) {
          // // 如果不存在税种，提示(仅财税助手嵌入时，不允许为空)
          // if (fromCszs && !formTaxList.length) {
          //   ShowConfirm({
          //     type: 'warning',
          //     width: 270,
          //     title: '您税种信息中未添加任何税种',
          //   });
          //   return;
          // }
          // 存在增值税，则校验附加税是否缺少
          const addedTax = formTaxList.find((item) => item.taxInfoId === 1);
          const lackTax = [];
          if (addedTax) {
            let additionalTaxIds = getAdditionalIds(areaName || '');
            // #129516 嵌入财税助手，附加税就3种
            if (fromCszs) {
              additionalTaxIds = [2, 3, 4];
            }
            for (let i = 0; i < additionalTaxIds.length; i += 1) {
              const id = additionalTaxIds[i];
              const index = formTaxList.findIndex((item) => item.taxInfoId === id);
              if (index < 0) {
                lackTax.push(TAX_MAP[id]);
              }
            }
          }
          if (lackTax.length) {
            ShowConfirm({
              width: 300,
              title: '您税种信息中已添加增值税',
              content: `未添加${lackTax.join('、')}，是否继续保存？`,
              async onOk() {
                onSubmit();
              },
            });
            return;
          }
          onSubmit();
        }
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

  return (
    <div className={classnames('custom-form-wrap', { 'is-alone': fromCszs })}>
      <Form>
        {!fromCszs && <BaseFrom form={form} />}
        <LoginForm ref={loginModeRef} />
        {/* <AgentForm form={form} /> */}
        {!isNationalTicket && (
          <>
            <FinanciaForm form={form} />
            <TaxCategoryForm ref={taxCategoryRef} />
          </>
        )}
        {!fromCszs && <Commissioner form={form} />}
      </Form>
      <BottomBtns isEditing={isEditing} onCancle={onCancle} onSave={beforeSubmit} onEdit={onEdit} />
    </div>
  );
};

const mapStateToProps = ({
  isEditing,
  loginFileds,
  formParams,
  formTaxList,
  isNationalTicket,
}) => ({
  formTaxList,
  loginFileds,
  isEditing,
  formParams,
  isNationalTicket,
  areaName: formParams.areaName,
});

export default connect(mapStateToProps)(
  Form.create({
    onValuesChange(props, changedFields) {
      // 处理表单个别字段
      const params = {
        ...props.formParams,
        ...changedFields,
      };
      const areaField = changedFields.areaCode;
      if (areaField) {
        params.areaCode = areaField.areaCode;
        params.areaName = areaField.areaName;
      }
      props.dispatch({
        type: 'updateState',
        payload: {
          formParams: params,
          isContChange: true,
        },
      });
    },
  })(Layout),
);
