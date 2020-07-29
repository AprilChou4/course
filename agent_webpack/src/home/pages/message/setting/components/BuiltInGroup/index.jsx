import React, { useLayoutEffect, useState } from 'react';
import { connect } from 'nuomi';
import { Button, Popover } from 'antd';
import classNames from 'classnames';
import { Authority } from '@components';

import './index.less';

function BuiltInGroup({ builtInGroupList, dispatch }) {
  // 计算内容的高度，切换 显示全部 按钮展示
  const [showMoreBtn, setShowMoreBtn] = useState(false);
  useLayoutEffect(() => {
    const builtInDom = document.querySelector('[data-id="builtInGroup"]') || {};
    const height = builtInDom.clientHeight;
    if (height > 61) {
      setShowMoreBtn(true);
    } else {
      setShowMoreBtn(false);
    }
  }, [builtInGroupList]);

  // 浮层弹窗内容
  function popverContent(title, list) {
    return (
      <div className="custormer-content">
        <h3 className="title">{title}</h3>
        <span>{(list || []).map((it) => it.name).join('，')}</span>
      </div>
    );
  }

  const showBuiltInModal = () => {
    dispatch({
      type: 'updateState',
      payload: {
        isShowBuiltInModal: true,
      },
    });
  };

  if (!builtInGroupList.length) return null;

  return (
    <div styleName="group-item">
      <div styleName="top">
        <div styleName="title-wrap">
          <span styleName="label">系统预置</span>
          <h3 styleName="title">客户分类</h3>
        </div>
        <div styleName="handle-wrap">
          <Authority code={555}>
            <Button onClick={showBuiltInModal}>编辑</Button>
          </Authority>
        </div>
      </div>
      <div styleName="content-wrap">
        <div styleName="content">
          <div
            data-id="builtInGroup"
            styleName={classNames('customer-list', { more: showMoreBtn })}
          >
            {builtInGroupList
              .filter((_) => _.selected)
              .map((item) => (
                <Popover
                  key={item.type}
                  placement="bottomLeft"
                  content={popverContent(item.classifyName, item.extendGroupValuelist)}
                  trigger="hover"
                  overlayClassName="message-custormer-group-popver"
                >
                  <Button styleName="customer-item">{item.classifyName}</Button>
                </Popover>
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

const mapStateToProps = ({ builtInGroupList }) => ({
  builtInGroupList,
});

export default connect(mapStateToProps)(BuiltInGroup);
