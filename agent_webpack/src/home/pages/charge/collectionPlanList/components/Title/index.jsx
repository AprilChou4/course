import React from 'react';
import { connect } from 'nuomi';
import Style from './style.less';

const Title = ({ dispatch, tableType, shouldReceiveBillData }) => {
  const { customerName, srbNo } = shouldReceiveBillData;
  const goTable = () => {
    dispatch({
      type: 'updateState',
      payload: {
        tableType: !tableType,
      },
    });
  };
  return (
    <div className="f-clearfix f-pr">
      <span className={Style['m-name']}>
        {customerName || '-'}（{srbNo || '-'}）
      </span>
      {tableType ? '收款计划表' : '收款计划明细表'}
      <a className={Style['m-entry']} onClick={goTable}>
        {tableType ? (
          <span>
            <i className="iconfont">&#xee18;</i>进入收款计划明细表
          </span>
        ) : (
          <span>
            <i className="iconfont">&#xee15;</i>返回收款计划表
          </span>
        )}
      </a>
    </div>
  );
};

export default connect(({ tableType, shouldReceiveBillData }) => ({
  tableType,
  shouldReceiveBillData,
}))(Title);
