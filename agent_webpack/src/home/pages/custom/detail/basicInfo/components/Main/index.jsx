// 客户详情 > 基本信息
import React, { useRef } from 'react';
import { Form } from 'antd';
import { connect, router } from 'nuomi';
import postMessageRouter from '@utils/postMessage';
import BaseForm from '../BaseForm/index';
import BusinessForm from '../BusinessForm/index';
import ShareholderForm from '../ShareholderForm/index';
import BottomBtns from '../../../layout/components/BottomBtns';

import './style.less';

const Main = ({ form, isEditing, dispatch }) => {
  // 股东信息组件ref
  const shareholderRef = useRef();
  // 提交
  function onSubmit(e) {
    e.preventDefault();
    form.validateFields(async (err) => {
      if (!err) {
        await dispatch({
          type: 'updateInfo',
        });
        form.resetFields();
        const childRef = shareholderRef.current.ref || {};
        childRef.current && childRef.current.resetFields();
      }
    });
  }

  // 取消
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
    <div className="custom-form-wrap">
      <Form>
        <BaseForm form={form} />
        <BusinessForm form={form} />
        <ShareholderForm ref={shareholderRef} />
        <BottomBtns isEditing={isEditing} onCancle={onCancle} onSave={onSubmit} onEdit={onEdit} />
      </Form>
    </div>
  );
};

const mapStateToProps = ({ isEditing, key }) => ({
  key,
  isEditing,
});

export default connect(mapStateToProps)(
  Form.create({
    onValuesChange(props, changedFields, allFields) {
      // 格式化参数： 时间、checkbox
      const formParams = {
        ...allFields,
        establishmentDate: allFields.establishmentDate
          ? allFields.establishmentDate.format('YYYY-MM-DD')
          : '',
        hasCampToIncreaseTaxReport: allFields.hasCampToIncreaseTaxReport ? 1 : 0,
        registeredCapital: allFields.registeredCapital === null ? -1 : allFields.registeredCapital,
        industryType: allFields.industryType || '',
        industryTypeParent: allFields.industryTypeParent || '',
        isProductOil: allFields.isProductOil === undefined ? -1 : allFields.isProductOil,
        isForeignTrade: allFields.isForeignTrade === undefined ? -1 : allFields.isForeignTrade,
        registrationType:
          allFields.registrationType === undefined ? -1 : allFields.registrationType,
      };
      props.dispatch({
        type: 'updateState',
        payload: {
          formParams,
          isContChange: true,
        },
      });
    },
  })(Main),
);
