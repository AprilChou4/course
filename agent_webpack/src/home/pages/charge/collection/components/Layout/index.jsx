import React, { useEffect } from 'react';
import { Layout, ContentWrapper, Iconfont, ShowConfirm } from '@components';
import { Form } from 'antd';
import { connect } from 'nuomi';
import Operations from '../Operations';
import Content from '../Content';

import './style.less';

const ChargeCollection = ({ form, isReference, isEdit, status, isViewPage, dispatch }) => {
  // 更新form
  useEffect(() => {
    dispatch({
      type: 'updateForm',
      payload: form,
    });
  }, [dispatch, form]);
  // 参照应收单显示modal
  const showModal = () => {
    const callback = () => {
      dispatch({
        type: '$showReferenceModal',
      });
    };
    if (isEdit) {
      ShowConfirm({
        title: '此操作会清空收款单已填信息，确定继续吗？',
        onOk() {
          form.resetFields();
          callback();
        },
      });
    } else {
      callback();
    }
  };

  // 清空参照
  const clearReference = () => {
    // form.resetFields();
    dispatch({
      type: '$clearReference',
    });
  };

  const Left =
    isViewPage || status > 1 ? null : (
      <>
        <a styleName="reference-receivable-btn" onClick={showModal}>
          <Iconfont code="&#xee12;" />
          &nbsp; 参照应收单
        </a>
        {isReference && (
          <a styleName="reference-receivable-btn" onClick={clearReference}>
            <Iconfont code="&#xee0a;" />
            &nbsp; 清空参照
          </a>
        )}
      </>
    );

  return (
    <Layout.PageWrapper>
      <ContentWrapper
        isPageHeader
        title="收款单"
        header={{
          left: Left,
          right: <Operations form={form} />,
        }}
        content={<Content form={form} />}
      />
    </Layout.PageWrapper>
  );
};

export default connect(({ formValues, isReference, status, isEdit, isViewPage }) => ({
  formValues,
  isReference,
  isEdit,
  status,
  isViewPage,
}))(
  Form.create({
    onValuesChange(props) {
      // 编辑改变按钮状态
      props.dispatch({
        type: 'changeStatus',
      });
    },
  })(ChargeCollection),
);
