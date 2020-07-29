import React, { useState } from 'react';
import { Modal, Form, Button, message, Icon } from 'antd';
import { connect } from 'nuomi';
import { InputLimit, TextAreaLimit } from '@components/InputLimit';

import './index.less';

function TheModal(props) {
  const { form, isShowModal, currentEditItem, addLoading, updateLoading, dispatch } = props;
  const { getFieldDecorator } = form;

  // 缓存敏感词，提交前在校验一次
  const [titleWords, setTitleWords] = useState([]);
  const [contentWors, setContentWords] = useState([]);

  // 关闭弹窗，需要重置表单
  const closeModal = () => {
    form.resetFields();
    dispatch({
      type: 'updateState',
      payload: {
        isShowMessageModal: false,
        currentTemplate: undefined,
      },
    });
  };

  // 敏感词错误弹窗
  const showSensitiveWarning = (words) => {
    Modal.warning({
      width: 400,
      icon: <Icon type="exclamation-circle" theme="filled" />,
      className: 'dialog-confirm',
      title: '您输入的内容包含以下敏感词汇不允许发送，请修改！',
      content: words.join('；'),
      okText: '知道了',
    });
  };

  // 失去焦点，检验是否含有敏感词
  const validateSensitive = async (key) => {
    const value = form.getFieldValue(key);
    if (!value || !value.trim()) return;
    const res = await dispatch({
      type: 'checkContent',
      payload: {
        type: key === 'title' ? 1 : 2,
        operateType: currentEditItem ? 2 : 1,
        messageId: currentEditItem ? currentEditItem.templateId : undefined,
        verifyContent: value,
      },
    });
    if (!res.result || res.result.type !== 2) {
      key === 'title' ? setTitleWords([]) : setContentWords([]);
      return;
    }
    const words = res.result.resultMsg.split(', ');
    showSensitiveWarning(words);
    key === 'title' ? setTitleWords(words) : setContentWords(words);
  };

  // 保存，检验是否重复主题
  const onSave = async ({ title, content }) => {
    const params = {
      templateTitle: title,
      templateContent: content,
    };
    if (currentEditItem) {
      params.templateId = currentEditItem.templateId;
    }
    const type = currentEditItem ? '$editTemplate' : '$addTemplate';
    const result = await dispatch({
      type,
      payload: params,
    });
    // 返回true代表成功
    if (result === true) {
      message.success(currentEditItem ? '修改成功' : '新增成功');
      closeModal();
      dispatch({
        type: '$getTemplateList',
      });
    } else if (result.status === 905) {
      // 标题重复
      form.setFields({
        title: {
          value: title,
          errors: [new Error('消息主题不能重复，请重新输入')],
        },
      });
    } else {
      message.error(result.message);
    }
  };

  // 提交，检验必填项、是否有敏感词
  const onSubmit = async () => {
    form.validateFields(async (err, values) => {
      if (!err) {
        if (!titleWords.length && !contentWors.length) {
          onSave(values);
        } else {
          // 敏感词, 去重
          showSensitiveWarning([...new Set([...titleWords, ...contentWors])]);
        }
      }
    });
  };

  // currentEditItem有值代表编辑状态
  const title = currentEditItem ? '编辑消息模板' : '新增消息模板';
  const { templateTile = '', templateContent = '' } = { ...currentEditItem };

  return (
    <Modal
      visible={isShowModal}
      maskClosable={false}
      title={title}
      footer={false}
      wrapClassName="message-template-modal"
      onCancel={closeModal}
      centered
    >
      <Form>
        <Form.Item label="消息主题">
          {getFieldDecorator('title', {
            initialValue: templateTile,
            rules: [
              {
                required: true,
                message: '请输入消息主题',
              },
            ],
          })(
            <InputLimit
              autoComplete="off"
              maxLength={15}
              placeholder="请输入消息主题，最多15个字"
              onBlur={() => validateSensitive('title')}
            />,
          )}
        </Form.Item>
        <Form.Item label="消息内容">
          {getFieldDecorator('content', {
            initialValue: templateContent,
            rules: [
              {
                required: true,
                message: '请输入消息内容',
              },
            ],
          })(
            <TextAreaLimit
              maxLength={500}
              autosize={{ minRows: 7 }}
              placeholder="请输入消息内容，最多500个字"
              onBlur={() => validateSensitive('content')}
            />,
          )}
        </Form.Item>
        <div className="handle-row">
          <Button type="plain" onClick={closeModal}>
            取消
          </Button>
          <Button type="primary" onClick={onSubmit} loading={addLoading || updateLoading}>
            保存
          </Button>
        </div>
      </Form>
    </Modal>
  );
}

const mapStateToProps = ({ isShowMessageModal, currentTemplate, loadings }) => ({
  isShowModal: isShowMessageModal,
  currentEditItem: currentTemplate,
  addLoading: loadings.$addTemplate,
  updateLoading: loadings.$editTemplate,
});

export default connect(mapStateToProps)(Form.create()(TheModal));
