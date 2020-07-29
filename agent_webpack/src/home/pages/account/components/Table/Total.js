import React from 'react';
import { connect } from 'nuomi';
import { Iconfont } from '@components';

const Total = ({ createdNum, notCheckOutNum, checkOutNum, ongoingNum, notStartNum }) => {
  return (
    <span>
      <Iconfont code="&#xea3d;" />
      <span>
        本月共 {createdNum} 个账套已建账
        {createdNum > 0 && (
          <span>
            ，其中：{notStartNum} 个账套未开始，{ongoingNum} 个账套进行中（{notCheckOutNum}{' '}
            个账套待结账），{checkOutNum} 个账套已结账
          </span>
        )}
      </span>
    </span>
  );
};

export default connect(
  ({ totalData: { createdNum, notCheckOutNum, checkOutNum, ongoingNum, notStartNum } }) => ({
    createdNum,
    notCheckOutNum,
    checkOutNum,
    ongoingNum,
    notStartNum,
  }),
)(Total);
