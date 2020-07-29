import React, { useState, useRef, useMemo, Fragment, useLayoutEffect, useEffect } from 'react';
import { Form, Input, Checkbox, Button, AutoComplete, message } from 'antd';
import { connect } from 'nuomi';
import pubData from 'data';
import { debounce } from 'lodash';
import trackEvent from 'trackEvent';
import { InputLimit, TextAreaLimit } from '@components/InputLimit';
import {
  getTemplateList,
  checkSensitive,
  checkAuthorized,
  sendMessage,
  updateMessage,
} from './api';
import TimingRadioGroup from '../TimingRadioGroup';
import SendObjectModal from '../SendObjectModal';
import { showSensitiveWarning, showSuccess, showFail, showUnauthorized } from './Modals';

import './index.less';

function MessageForm({ form, messageData, onSuccessCallBack }) {
  const authoritys = pubData.get('authority');
  // 缓存敏感词，提交前在校验一次
  const [titleWords, setTitleWords] = useState([]);
  const [contentWors, setContentWords] = useState([]);
  // 发送时点组件的ref
  const refTimingGroup = useRef();
  // 发送对象组件的ref
  const refSendObj = useRef();
  // 预置模板用div展示，因为有标签
  const [builtTemplate, setBuiltTemplate] = useState({});

  // 消息模板列表
  const [templateList, setTemplateList] = useState([]);
  const [isShowTiming, setShowTiming] = useState(() => {
    // 有及时发送消息，没有定时发送消息
    if (authoritys[545] && !authoritys[546]) {
      return false;
    }
    // 有定时发送消息，没有及时发送消息
    if (authoritys[546] && !authoritys[545]) {
      return true;
    }
    return Boolean(messageData.msgTimingType);
  });
  const [sendObjectArr, setSendObjectArr] = useState(messageData.customers || []);
  const [isModalShow, setShowModal] = useState(false);
  // isReRender代表是否重新渲染，发送成功后，要设置为true，从而重新渲染发送对象弹窗
  const [isRerender, setReRender] = useState(true);

  // 根据模板和传来的id做匹配，匹配成功，代表是内置模板
  useLayoutEffect(() => {
    if (templateList.length && messageData.msgTemplateId) {
      const currentTemp = templateList.find((it) => it.templateId === messageData.msgTemplateId);
      // templateType === 2代表内置
      if (currentTemp && currentTemp.templateType === 2) {
        // templateType
        setBuiltTemplate(currentTemp || {});
      }
    }
  }, [templateList, messageData]);

  // 初始化先请求一次模板列表，防止编辑时，匹配不上内置模板
  useEffect(() => {
    const fetchData = async () => {
      const res = await getTemplateList();
      setTemplateList(res.data && res.data.msgTemplates);
    };
    fetchData();
  }, []);

  // 清空表单
  const resetForm = () => {
    form.resetFields();
    setSendObjectArr([]);
    setBuiltTemplate({});
    onSuccessCallBack && onSuccessCallBack();
    refTimingGroup.current && refTimingGroup.current.resetFields();
    setReRender(false);
    // refSendObj.current && refSendObj.current.resetFields();
  };

  // 提交
  const onSubmit = async (params) => {
    let isShowed = false;
    let timer;
    // 即时消息需要在考虑1s
    if (!params.msgTimingType) {
      timer = setTimeout(() => {
        !isShowed && showSuccess(true, null, resetForm);
        isShowed = true;
      }, 1000);
    }

    let res;
    if (messageData.msgId) {
      res = await updateMessage({ ...params, msgId: messageData.msgId });
    } else {
      trackEvent('消息推送', '发送消息', '发送'); // 事件埋点
      res = await sendMessage(params);
    }
    if (isShowed) return;
    isShowed = true;
    if (res.status === 200) {
      showSuccess(null, Boolean(params.msgTimingType), resetForm);
    } else {
      clearTimeout(timer);
      if (res.status === 906) {
        showFail(res.message, resetForm);
      } else {
        message.error(res.message);
      }
    }
  };

  // 校验
  const onValidate = () => {
    form.validateFields(async (err, values) => {
      //  定时发送勾选，要校验发送时点
      let timingPass = true;
      if (isShowTiming) {
        timingPass = refTimingGroup.current.validateFields();
      }
      if (!err && timingPass) {
        // 存在敏感词，弹窗提示
        if (titleWords.length || contentWors.length) {
          showSensitiveWarning([...new Set([...titleWords, ...contentWors])]);
          return;
        }
        // 整合参数
        const params = {
          sendObjects: sendObjectArr.map((it) => ({
            customerId: it.customerId,
            customerName: it.customerName,
            grantUserIds: it.grantUsers.map((_) => _.userId),
          })),
          msgTemplateId: builtTemplate.templateId, // 使用消息模板
          msgTitle: values.title,
          msgContent: values.content,
          sendTime: !isShowTiming ? Date.now() : undefined,
          msgTimingType: 0, // 默认即时消息，存在发送时点重新赋值
        };
        // 获取子组件发送时点的form值
        if (isShowTiming) {
          const timmingValues = refTimingGroup.current.getFieldsValue();
          const { timingType, ...rest } = timmingValues;
          params.msgTimingType = timingType;
          Object.keys(rest).forEach((key) => {
            params[key] = rest[key];
          });
        }
        const res = await checkAuthorized(params);
        if (res.data && !res.data.result.length) {
          onSubmit(params);
          return;
        }
        // 存在未授权等情况
        if (res.data) {
          showUnauthorized(res.data.result, Boolean(messageData.msgId), () => {
            onSubmit(params);
          });
        } else {
          // 无法发送
          message.error(res.message);
        }
      }
    });
  };

  // CheckBox按钮切换
  const onCheckBoxChange = (e) => {
    setShowTiming(e.target.checked);
  };

  // 检验敏感词
  const validateSensitive = async (key) => {
    const value = form.getFieldValue(key);
    if (!value || !value.trim()) return;
    const res = await checkSensitive({
      type: key === 'title' ? 1 : 2,
      operateType: 1,
      verifyContent: value,
    });

    if (!res.data) return;

    // type = 2代表是敏感词、
    if (!res.data.result || res.data.result.type !== 2) {
      key === 'title' ? setTitleWords([]) : setContentWords([]);
      return;
    }
    const words = res.data.result.resultMsg.split(', ');
    showSensitiveWarning(words);
    key === 'title' ? setTitleWords(words) : setContentWords(words);
  };

  // 标题选择
  const onSelect = (value) => {
    const currentTemp = templateList.find((tempalte) => tempalte.templateTile === value);
    const { templateType, templateContent } = currentTemp;
    form.setFieldsValue({
      content: templateContent,
    });

    // 如果选择内置消息模板，不允许修改内容
    if (templateType === 2) {
      setBuiltTemplate(currentTemp || {});
      authoritys[546] && setShowTiming(true);
    }
  };

  // 标题修改, 恢复消息内容框
  const onTitleChange = () => {
    if (builtTemplate.templateId) {
      form.setFieldsValue({
        content: '',
      });
    }
    setBuiltTemplate({});
  };

  // 展示发送对象的弹窗
  const showSendObjModal = (e) => {
    setReRender(true);
    setShowModal(true);
    e.target.blur();
  };

  // 用于自动补全输入框检索
  const dataSource = templateList.map((tempalte) => tempalte.templateTile);
  // const AutoCompleteOptions = templateList.map((tempalte) => (
  //   <Option key={tempalte.templateId}>{tempalte.templateTile}</Option>
  // ));
  // 初始值计算: 发送对象字符串、消息主题、消息内容
  const currentMessage = useMemo(() => {
    const res = { ...messageData };

    res.sendUsers = sendObjectArr
      .map((obj) => {
        const names = obj.grantUsers.map(({ username }) => username);
        return `${obj.customerName}（${names.join('，')}）`;
      })
      .join('，');

    res.initialTitle = messageData.msgTitle;
    res.initialContent = messageData.msgContent;

    return res;
  }, [messageData, sendObjectArr]);

  const { getFieldDecorator } = form;

  return (
    <>
      <Form className="send-message-form">
        <Form.Item label="发送对象">
          {getFieldDecorator('users', {
            rules: [{ required: true, message: '请选择发送对象' }],
            initialValue: currentMessage.sendUsers,
          })(
            <Input
              className="send-obj-input"
              autoComplete="off"
              placeholder="请选择发送对象"
              onFocus={showSendObjModal}
              readOnly
            />,
          )}
        </Form.Item>
        <Form.Item label="消息主题">
          {getFieldDecorator('title', {
            rules: [{ required: true, message: '请输入消息主题' }],
            initialValue: currentMessage.initialTitle || '',
          })(
            <AutoComplete
              dataSource={dataSource}
              onSelect={onSelect}
              filterOption={(inputValue, option) =>
                option.props.children.indexOf(inputValue.toUpperCase()) !== -1
              }
              onChange={onTitleChange}
              onBlur={() => validateSensitive('title')}
            >
              <InputLimit autoComplete="off" placeholder="请输入标题，最多15个字" maxLength={15} />
            </AutoComplete>,
          )}
        </Form.Item>
        {/* eslint-disable react/no-danger */}
        <Form.Item label="消息内容">
          {getFieldDecorator('content', {
            rules: [{ required: true, message: '请输入消息内容' }],
            initialValue: currentMessage.initialContent || '',
          })(
            builtTemplate.templateId ? (
              <div
                className="built-content"
                dangerouslySetInnerHTML={{ __html: builtTemplate.templateContent }}
              />
            ) : (
              <TextAreaLimit
                maxLength={500}
                autosize={{ minRows: 7 }}
                placeholder="请输入发送内容，最多500个字"
                onBlur={() => validateSensitive('content')}
              />
            ),
          )}
        </Form.Item>
        {authoritys[545] && !authoritys[546] ? null : (
          <div className="timing-wrap">
            {authoritys[545] ? (
              <Checkbox onChange={onCheckBoxChange} checked={isShowTiming}>
                定时发送
              </Checkbox>
            ) : null}

            {isShowTiming && (
              <TimingRadioGroup
                timingTypes={builtTemplate.timeTypes}
                messageData={currentMessage}
                wrappedComponentRef={(inst) => (refTimingGroup.current = inst)}
              />
            )}
          </div>
        )}

        <div className="handle-row">
          {authoritys[545] || authoritys[546] ? (
            <Button type="primary" id="send-message-btn" onClick={debounce(onValidate, 800)}>
              {messageData.msgId ? '保存' : '发送'}
            </Button>
          ) : null}
        </div>
      </Form>
      {isRerender && (
        <SendObjectModal
          ref={refSendObj}
          isModalShow={isModalShow}
          initialSelectList={messageData.customers || []}
          onClose={() => setShowModal(false)}
          onSendObjChange={(arr) => setSendObjectArr(arr)}
        />
      )}
    </>
  );
}

export default connect()(Form.create()(MessageForm));
