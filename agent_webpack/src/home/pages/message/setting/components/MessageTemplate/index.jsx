import React from 'react';
import { connect } from 'nuomi';
import { Input, Button, Spin, message } from 'antd';
import trackEvent from 'trackEvent';
import showConfirm from '@components/ShowConfirm';
import TemplateItem from '../TemplateItem';
import { request } from '@utils';
import { Authority } from '@components';

import './index.less';

const { Search } = Input;

function MessageTemplate({ templateList, loadings, templateInputVal, dispatch }) {
  // 删除模板
  const onDelete = (templateId) => {
    showConfirm({
      title: '您确定要删除本条消息模板吗？',
      content: '一经删除无法恢复。',
      okText: '确定',
      cancelText: '取消',
      async onOk() {
        const res = await request.post('/instead/v2/message/template/delete.do', {
          templateId,
        });
        if (!res) return;
        message.success('删除成功');
        dispatch({
          type: '$getTemplateList',
        });
      },
    });
  };

  // 搜索
  const onSearch = async () => {
    dispatch({
      type: '$getTemplateList',
    });
  };

  const onChange = (e) => {
    dispatch({
      type: 'updateState',
      payload: {
        templateInputVal: e.target.value,
      },
    });
  };

  // 展示编辑、新增弹窗
  const showModal = (currentTemplate) => {
    // currentTemplate 可能是event对象
    const template = currentTemplate.templateTile ? currentTemplate : undefined;
    //
    if (!template) {
      trackEvent('消息设置', '新增消息模板'); // 事件埋点
    }
    dispatch({
      type: 'updateState',
      payload: {
        isShowMessageModal: true,
        currentTemplate: template,
      },
    });
  };

  return (
    <div styleName="message-template">
      <Search
        placeholder="请输入消息主题搜索"
        allowClear
        value={templateInputVal}
        onSearch={onSearch}
        onChange={onChange}
        enterButton
      />
      <Authority code={554}>
        <Button type="primary" onClick={showModal} className="add-new-btn">
          新增消息模板
        </Button>
      </Authority>
      <div styleName="template-list">
        <Spin spinning={loadings.$getTemplateList} wrapperClassName="spin-wrap">
          {templateList.map((item) => (
            <TemplateItem
              key={item.templateId}
              data={item}
              onDelete={onDelete}
              onEdit={showModal}
            />
          ))}
          {!templateList.length && !loadings.$getTemplateList && (
            <div styleName="no-result">
              <div styleName="default-image"></div>
              <p>暂无数据</p>
            </div>
          )}
        </Spin>
      </div>
    </div>
  );
}

const mapStateToProps = ({ templateList, loadings, templateInputVal }) => ({
  templateList,
  loadings,
  templateInputVal,
});

export default connect(mapStateToProps)(MessageTemplate);
