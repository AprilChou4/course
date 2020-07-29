import React, { useState } from 'react';
import { connect } from 'nuomi';
import { Input, Button, Spin, message } from 'antd';
import trackEvent from 'trackEvent';
import GroupItem from '../GroupItem';
import BuiltInGroup from '../BuiltInGroup';
import showConfirm from '@components/ShowConfirm';
import { Authority } from '@components';

import './index.less';

const { Search } = Input;

function CustomerGroup({ groupList, loadings, groupInputVal, dispatch }) {
  // 根据搜索条件，决定是否显示预置分组
  const [isShowBuiltGroup, setShowBuildGroup] = useState(true);

  // 搜索
  const onSearch = () => {
    dispatch({
      type: '$getGroupList',
    });
    setShowBuildGroup('系统预置客户分类'.includes(groupInputVal));
  };

  const onChange = (e) => {
    dispatch({
      type: 'updateState',
      payload: {
        groupInputVal: e.target.value,
      },
    });
  };

  // 删除
  const onDelete = (groupId) => {
    showConfirm({
      title: '您确定要删除本条客户分组吗？',
      content: '一经删除无法恢复。',
      okText: '确定',
      cancelText: '取消',
      async onOk() {
        const res = await dispatch({
          type: 'deleteGroup',
          payload: groupId,
        });
        if (!res) {
          message.success('删除成功');
          dispatch({
            type: '$getGroupList',
          });
        }
      },
    });
  };

  // 展示编辑窗
  const showModal = (currentGroup) => {
    const group = currentGroup.groupId ? currentGroup : undefined;
    if (!group) {
      trackEvent('消息设置', '新增客户分组'); // 事件埋点
    }
    dispatch({
      type: 'updateState',
      payload: {
        isShowCustomerModal: true,
        currentGroup: group,
      },
    });
  };

  return (
    <div styleName="customer-group">
      <Search
        placeholder="输入分组名称搜索"
        value={groupInputVal}
        onSearch={onSearch}
        onChange={onChange}
        enterButton
      />
      <Authority code={554}>
        <Button type="primary" onClick={showModal} className="add-new-btn">
          新增客户分组
        </Button>
      </Authority>
      <div styleName="group-list">
        <Spin
          spinning={loadings.$getGroupList || loadings.$getBuiltInGroupList}
          wrapperClassName="spin-wrap"
        >
          {groupList.map((item) => (
            <GroupItem key={item.groupId} data={item} onDelete={onDelete} onEdit={showModal} />
          ))}
          {isShowBuiltGroup && <BuiltInGroup />}
          {!isShowBuiltGroup && !groupList.length && (
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

const mapStateToProps = ({ groupList, loadings, groupInputVal }) => ({
  groupList,
  loadings,
  groupInputVal,
});

export default connect(mapStateToProps)(CustomerGroup);
