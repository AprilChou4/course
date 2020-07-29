import React, { Fragment, useLayoutEffect, useState } from 'react';
import { Button } from 'antd';
import classNames from 'classnames';
import moment from 'moment';
import sendTimeMap from './sendTimeMap';
import { Authority } from '@components';

import './index.less';

function TemplateItem({ data, onDelete, onEdit }) {
  const [showMoreBtn, setShowMoreBtn] = useState(false);

  // 计算消息内容的行数，切换 显示全部 按钮展示
  useLayoutEffect(() => {
    const height = document.querySelector(`[data-tempid="${data.templateId}"]`).clientHeight;
    if (height > 20) {
      setShowMoreBtn(true);
    }
  }, []);

  return (
    <div styleName="template-item">
      <div styleName="top">
        <div styleName="title-wrap">
          {data.templateType === 2 && (
            <Fragment>
              <span styleName="label">系统预置</span>
              <i className="iconfont">&#xec8b;</i>
            </Fragment>
          )}
          <h3 styleName="title">{data.templateTile}</h3>
        </div>
        <div styleName="handle-wrap">
          {data.templateType !== 2 && (
            <Authority code={555}>
              <Button onClick={() => onEdit(data)}>编辑</Button>
            </Authority>
          )}
          <Authority code={556}>
            <Button onClick={() => onDelete(data.templateId)}>删除</Button>
          </Authority>
        </div>
      </div>
      <div styleName="content-wrap">
        {data.templateType === 2 ? (
          <span>发送时点：{data.timeTypes.map((type) => sendTimeMap[type]).join(' / ')}</span>
        ) : (
          <Fragment>
            <span>操作时点：{moment(data.operateTime).format('YYYY-MM-DD HH:mm:ss')}</span>
            <span styleName="edit-user">操作人：{data.operateUsername}</span>
          </Fragment>
        )}

        <div styleName="content">
          <span styleName="label">消息内容：</span>
          <div
            styleName={classNames('text-wrap', {
              nowrap: showMoreBtn,
            })}
          >
            {/* eslint-disable react/no-danger */}
            <span dangerouslySetInnerHTML={{ __html: data.templateContent }}></span>
            <p
              dangerouslySetInnerHTML={{ __html: data.templateContent }}
              data-tempid={data.templateId}
            ></p>
            {showMoreBtn && (
              <span styleName="show-more-btn" onClick={() => setShowMoreBtn(false)}>
                显示全部
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TemplateItem;
