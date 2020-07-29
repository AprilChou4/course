import React, { Fragment, useState } from 'react';
import { Input, Icon, Button, Popover, TreeSelect } from 'antd';

import './index.less';

const { TreeNode } = TreeSelect;

function SearchInput({ modalVisible, customerParams, builtInGroupList, dispatch }) {
  // 控制隐藏展示
  const [visible, setVisible] = useState(false);

  // 五个条件
  const [query, setQuery] = useState([]);

  const onClick = () => {
    setVisible((prev) => !prev);
  };

  const onChange = (e) => {
    dispatch({
      type: 'getCustomerList',
      payload: {
        customerName: e.target.value,
        queryCriteria: [],
        current: 1,
      },
    });
  };

  const onTreeSelect = (index, item) => {
    setQuery((prev) => {
      const copy = [...prev];
      copy[index] = item;
      return copy;
    });
  };

  const onSubmit = () => {
    const queryCriteria = query
      .filter((it) => it)
      .map((it) => {
        const [, type, value] = it.split('-');
        return { type, value };
      });
    const names = query.filter((it) => it).map((it) => it.split('-')[3]);
    dispatch({
      type: 'getCustomerList',
      payload: {
        queryCriteria,
        customerName: names.join('；'),
      },
    });
    setVisible(false);
  };

  const onVisibleChange = () => {
    setVisible(false);
  };

  const onRest = () => {
    setQuery([]);
  };

  // 浮层内容
  const popverContent = () => {
    const queries = ['一', '二', '三', '四', '五'];
    return (
      <Fragment>
        {queries.map((num, index) => (
          <div className="form-item" key={num}>
            <span className="label">条件{num}：</span>
            <TreeSelect
              getPopupContainer={(triggerNode) => triggerNode.parentNode}
              allowClear
              onChange={(key) => onTreeSelect(index, key)}
              placeholder="请选择"
              value={query[index]}
              dropdownStyle={{ maxHeight: '300px' }}
            >
              {builtInGroupList
                .filter((it) => it.selected)
                .map((group) => (
                  <TreeNode
                    value={group.classifyName}
                    title={group.classifyName}
                    key={group.classifyName}
                    selectable={false}
                  >
                    {group.extendGroupValuelist.map(({ name, value }) => (
                      <TreeNode
                        value={`${index}-${group.type}-${value}-${name}`}
                        title={name}
                        key={`${group.type}-${value}`}
                      />
                    ))}
                  </TreeNode>
                ))}
            </TreeSelect>
          </div>
        ))}
        <div className="handle-wrap">
          <Button onClick={onRest}>清空</Button>
          <Button type="primary" onClick={onSubmit}>
            查询
          </Button>
        </div>
      </Fragment>
    );
  };

  return (
    <div>
      <Popover
        content={popverContent()}
        trigger="click"
        placement="bottomLeft"
        visible={visible && modalVisible}
        onVisibleChange={onVisibleChange}
        overlayClassName="search-custormer-group-popver"
        getPopupContainer={(triggerNode) => triggerNode.parentNode}
      >
        <Input
          className="more-condition-input"
          readOnly={customerParams.queryCriteria.length}
          allowClear
          prefix={<Icon type="search" />}
          placeholder="请输入客户名称搜索"
          suffix={
            <Button type="link" style={{ padding: '0', verticalAlign: 'middle' }} onClick={onClick}>
              更多条件
            </Button>
          }
          value={customerParams.customerName}
          onChange={onChange}
        />
      </Popover>
    </div>
  );
}

export default SearchInput;
