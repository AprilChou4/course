/* eslint-disable import/no-cycle */
/**
 * 账套移交
 */
import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Badge } from 'antd';
import { connect } from 'nuomi';
import services from '../../../services';
import { VisibleContext } from '../index';

const AccountHandover = ({ dispatch }) => {
  const [count, setCount] = useState(0);
  const dropdownVisible = useContext(VisibleContext);
  // 统计待接收记录数
  const getReceiptNum = useCallback(async () => {
    const data = await services.getReceiptNum();
    setCount(data || 0);
  }, []);

  const handleClick = () => {
    dispatch({
      type: 'accountHandover/updateState',
      payload: {
        visible: true,
      },
    });
  };

  useEffect(() => {
    // 每次展开下拉框时重新请求
    if (dropdownVisible) {
      getReceiptNum();
    }
  }, [dropdownVisible, getReceiptNum]);

  return (
    <>
      <div onClick={handleClick}>
        <Badge count={count} offset={[10]}>
          账套移交
        </Badge>
      </div>
    </>
  );
};

export default connect()(AccountHandover);
