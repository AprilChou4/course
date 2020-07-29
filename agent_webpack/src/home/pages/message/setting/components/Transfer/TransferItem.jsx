import React, { useState, useEffect } from 'react';
import { Checkbox, Pagination, Input, Icon } from 'antd';

import './transferItem.less';

const CheckboxGroup = Checkbox.Group;

function TransferItem({
  showSelectAll = { name: '全选' }, // 是否展示全选勾选框
  filterOption, // 展示搜索框、过滤方法。customerSearch优先
  customerSearch = null, // 自定义搜索框
  dataSource = [], // 源数据
  pagination = null, // 分页相关，不传不显示
  checkedList,
  setCheckedList,
  searchPlaceholder,
}) {
  const allKeys = dataSource.map((it) => it.value);
  const [checkAll, setCheckAll] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [isComposition, setComposition] = useState(false);

  // 根据checkedList、allKeys改变左上角显示
  useEffect(() => {
    const bool = checkedList.length > 0 && checkedList.length < allKeys.length;
    setIndeterminate(bool);
  }, [checkedList, allKeys]);
  useEffect(() => {
    const bool = checkedList.length === allKeys.length && allKeys.length > 0;
    setCheckAll(bool);
  }, [checkedList, allKeys]);

  // 多选按钮切换
  function onCheckChange(list) {
    setCheckedList(list);
  }

  // 全选切换
  function onCheckAllChange(e) {
    setCheckedList(e.target.checked ? allKeys : []);
  }

  function onInputChange(e) {
    if (!isComposition) {
      setSearchVal(e.target.value);
    }
  }

  function onCompositionEnd(e) {
    setSearchVal(e.target.value);
    setComposition(false);
  }

  const renderList =
    typeof filterOption === 'function' ? filterOption(searchVal, dataSource) : dataSource;

  return (
    <div styleName="transfer-list">
      <div styleName="transfer-list-header">
        {showSelectAll && (
          <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
            {showSelectAll.name}
          </Checkbox>
        )}
      </div>
      <div styleName="transfer-list-body">
        {customerSearch && <div styleName="transfer-list-body-search-wrap">{customerSearch}</div>}
        {filterOption && !customerSearch && (
          <div styleName="transfer-list-body-search-wrap">
            <Input
              placeholder={searchPlaceholder}
              prefix={<Icon type="search" style={{ color: 'rgba(0,0,0,.25)' }} />}
              onChange={onInputChange}
              allowClear
              onCompositionStart={() => setComposition(true)}
              onCompositionEnd={onCompositionEnd}
            />
          </div>
        )}
        {renderList.length ? (
          <CheckboxGroup
            style={{ height: pagination ? '320px' : '355px' }}
            options={renderList}
            value={checkedList}
            onChange={onCheckChange}
          />
        ) : null}
        {!renderList.length && (
          <div styleName="no-result">
            <div styleName="default-image"></div>
            <p>暂无数据</p>
          </div>
        )}
        {pagination && <Pagination {...pagination} simple />}
      </div>
    </div>
  );
}

export default TransferItem;
