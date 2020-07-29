import React, { useState, useContext, useEffect, useCallback, useMemo } from 'react';
import { Button, Input, message } from 'antd';
import { connect } from 'nuomi';
import { ShowConfirm } from '@components';
import './style.less';

const inputStyle = {
  width: 320,
};
const Header = ({ selectedRowKeys, dispatch }) => {
  const handleSearch = useCallback(
    (value, e) => {
      dispatch({
        type: '$getRecycleBinList',
        payload: { accountName: value, current: 1 },
      });
    },
    [dispatch],
  );

  const handleInputChange = useCallback(
    (e) => {
      const { value } = e.target;
      // 清空时搜索
      if (!value) {
        handleSearch(value, e);
      }
    },
    [handleSearch],
  );

  const handleBatchDelete = useCallback(() => {
    if (!selectedRowKeys.length) {
      message.warning('请选择要删除的帐套');
      return;
    }
    ShowConfirm({
      title: '批量删除账套后，账套数据无法恢复，确定删除？',
      onOk() {
        dispatch({
          type: 'delete',
          payload: {
            list: selectedRowKeys,
          },
        });
      },
    });
  }, [dispatch, selectedRowKeys]);

  return (
    <div className="f-clearfix">
      <div styleName="left">
        <Input.Search
          allowClear
          enterButton
          placeholder="请输入帐套名称"
          autoComplete="off"
          style={inputStyle}
          onSearch={handleSearch}
          onChange={handleInputChange}
        />
      </div>
      <div styleName="right">
        <Button type="primary" onClick={handleBatchDelete}>
          批量删除
        </Button>
      </div>
    </div>
  );
};

export default connect(({ table: { selectedRowKeys } }) => ({
  selectedRowKeys,
}))(Header);
