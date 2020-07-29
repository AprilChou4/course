// 服务中客户 > 操作
import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'nuomi';
import trackEvent from 'trackEvent';
import postMessageRouter from '@utils/postMessage';
import Authority from '@components/Authority';
import TextButton from '@components/TextButton';

const Operate = ({ record, dispatch }) => {
  const { customerId, isCreate, customerServiceRelationList, openAccount } = record;

  /** 查看/编辑
   * {*string} isEdit 1=编辑 0=查看
   */
  const detail = useCallback(
    (isEdit) => {
      postMessageRouter({
        type: 'agentAccount/routerLocation',
        payload: {
          url: '/custom/detail/',
          query: {
            tab: '1',
            isEdit,
            customerId: record.customerId,
          },
        },
      });
    },
    [record.customerId],
  );

  // 建账
  const trash = useCallback(() => {
    dispatch({
      type: '$checkCustomer',
      payload: {
        customerId,
        record,
      },
    });
  }, [customerId, dispatch, record]);

  // 跟进
  const follow = useCallback(() => {
    dispatch({
      type: 'updateState',
      payload: {
        isFollowVisible: true,
        currRecord: record,
      },
    });
  }, [dispatch, record]);

  // 开户
  const openTheAccount = useCallback(() => {
    dispatch({
      type: '$checkSocialCode',
      payload: {
        record,
      },
    }).then((res) => {
      if (res) {
        postMessageRouter({
          type: 'agentAccount/routerLocation',
          payload: {
            url: '/jumpIcbc',
            query: {
              id: customerId,
            },
          },
        });
        trackEvent('客户管理', '开户跳转');
      }
    });
  }, [customerId, dispatch, record]);

  // 相应权限：查看(3)，编辑(5)，建账(10), 跟进(536); 没有勾选代理记账(record.serviceType等于0)时，不显示"建账"
  // isCreate 0=未建账 1=已建账
  const serviceTypeArr = customerServiceRelationList.map((item) => item.companyServiceTypeValue);
  const isTrash = serviceTypeArr.includes(0) && isCreate === 0; // 是否有建账按钮

  return (
    <span>
      <Authority code="3">
        <TextButton onClick={() => detail(0)}>查看</TextButton>
      </Authority>
      <Authority code="5">
        {(isCreate === 1 || !serviceTypeArr.includes(0)) && (
          <TextButton onClick={() => detail(1)}>编辑</TextButton>
        )}
      </Authority>
      {isTrash && (
        <Authority code="10">
          <TextButton onClick={trash}>建账</TextButton>
        </Authority>
      )}
      <Authority code="536">
        <TextButton onClick={follow}>跟进</TextButton>
      </Authority>
      {openAccount && <TextButton onClick={openTheAccount}>开户</TextButton>}
    </span>
  );
};

Operate.propTypes = {
  record: PropTypes.object,
};

export default connect()(Operate);
