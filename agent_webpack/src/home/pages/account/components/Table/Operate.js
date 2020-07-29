import React, { useState, useContext, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'nuomi';
import { LinkButton, Authority, ShowConfirm } from '@components';
import { role, openUrl } from '../../utils';
import './style.less';

const Operations = ({
  data,
  data: { accountId, accountName, schedule, status },
  onEdit,
  dispatch,
}) => {
  const handleCheck = () => {
    openUrl(data, 'terminal/checkout');
  };

  const handleDelete = () => {
    ShowConfirm({
      title: `确定要删除“${accountName}”吗？`,
      content: '删除后如果想要恢复，可在“更多-回收站”里进行恢复',
      onOk() {
        dispatch({
          type: 'deleteAccount',
          payload: {
            accountId,
          },
        });
      },
    });
  };
  const isStop = status === 1;

  const checkDisabled = schedule === 1 || isStop;
  // 未建账的 风险检测置灰
  return (
    <div className="btn-operations">
      {role !== 3 && (
        <Authority>
          <LinkButton onClick={handleCheck} disabled={checkDisabled}>
            风险检测
          </LinkButton>
        </Authority>
      )}
      <Authority code="58">
        <LinkButton onClick={() => onEdit(data)} disabled={isStop}>
          编辑
        </LinkButton>
      </Authority>
      <Authority code="59">
        <LinkButton onClick={handleDelete}>删除</LinkButton>
      </Authority>
    </div>
  );
};

Operations.propTypes = {
  onEdit: PropTypes.func,
};

export default connect()(Operations);
