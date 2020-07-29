// 客户管理>跟进
import React, { Component, useCallback } from 'react';
import { Modal } from 'antd';
import { connect } from 'nuomi';
import MentionInput from './MentionInput';
import FollowList from './FollowList';
import Style from './style.less';

const FollowUp = (props) => {
  const {
    dispatch,
    isFollowVisible,
    currRecord: { customerName },
  } = props;
  // 取消
  const onCancel = useCallback(() => {
    dispatch({
      type: 'updateState',
      payload: {
        isFollowVisible: false,
        followCurrent: 1,
        isFollowHasMore: true,
        followList: [],
      },
    });
  }, [dispatch]);

  return (
    <>
      {isFollowVisible && (
        <Modal
          title={`跟进记录-${customerName}`}
          width={720}
          height={478}
          centered
          className={Style['m-followUp']}
          maskClosable={false}
          destroyOnClose={false}
          visible={isFollowVisible}
          onCancel={onCancel}
          footer={null}
        >
          <MentionInput />
          <FollowList />
        </Modal>
      )}
    </>
  );
};
export default connect(({ isFollowVisible, currRecord }) => ({
  isFollowVisible,
  currRecord,
}))(FollowUp);
