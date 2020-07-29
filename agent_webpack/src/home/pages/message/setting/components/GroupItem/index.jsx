import React, { useLayoutEffect, useState } from 'react';
import { Button } from 'antd';
import classNames from 'classnames';
import moment from 'moment';
import { Authority } from '@components';

import './index.less';

function GroupItem({ data, onDelete, onEdit }) {
  const [showMoreBtn, setShowMoreBtn] = useState(false);

  // 计算内容的高度，切换 显示全部 按钮展示
  useLayoutEffect(() => {
    const height = document.querySelector(`[data-groupid="${data.groupId}"]`).clientHeight;
    if (height > 61) {
      setShowMoreBtn(true);
    }
  }, []);

  return (
    <div styleName="group-item">
      <div styleName="top">
        <div styleName="title-wrap">
          <h3 styleName="title">{data.groupName}</h3>
        </div>
        <div styleName="handle-wrap">
          <Authority code={555}>
            <Button onClick={() => onEdit(data)}>编辑</Button>
          </Authority>
          <Authority code={556}>
            <Button onClick={() => onDelete(data.groupId)}>删除</Button>
          </Authority>
        </div>
      </div>
      <div styleName="content-wrap">
        <span>操作时点：{moment(data.operatorTime).format('YYYY-MM-DD HH:mm:ss')}</span>
        <span styleName="edit-user">操作人：{data.operator}</span>
        <div styleName="content">
          <div
            data-groupid={data.groupId}
            styleName={classNames('customer-list', { more: showMoreBtn })}
          >
            {data.customers.map((customer) => (
              <div styleName="customer-item" key={customer.customerId}>
                {customer.customerName}
              </div>
            ))}
          </div>
          {showMoreBtn && (
            <span styleName="show-more-btn" onClick={() => setShowMoreBtn(false)}>
              显示全部
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default GroupItem;
