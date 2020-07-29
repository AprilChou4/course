import React, { useState, useImperativeHandle, forwardRef } from 'react';
import TransferItem from './TransferItem';
import TransferOperation from './TransferOperation';

import './index.less';

function Transfer(
  {
    leftOptions, // 左侧的一些参数
    rightOptions, // 右侧的一些参数
    dataSource, // 源数据
    targetData = [], // 已选数据
    operations = [],
    handleChange,
  },
  ref,
) {
  // 计算源数据，向dataSource中增加disabled
  const targetKeys = targetData.map((it) => it.value);
  const sourceData = dataSource.map((it) => ({ ...it, disabled: targetKeys.includes(it.value) }));

  // 选中的keys，提取到父组件，控制operations的禁用
  const [leftSelectKeys, setLeftSelectKeys] = useState([]);
  const [rightSelectKeys, setRightSelectKeys] = useState([]);

  // 自定义暴露给父组件的实例值, 转发ref
  useImperativeHandle(ref, () => ({
    resetValues: () => {
      setLeftSelectKeys([]);
      setRightSelectKeys([]);
    },
  }));

  // 向右
  const toRight = () => {
    const leftData = dataSource.filter((it) => leftSelectKeys.includes(it.value));
    handleChange([...targetData, ...leftData]);
    setLeftSelectKeys([]);
  };

  // 向左
  const toLeft = () => {
    const remainData = targetData.filter((it) => !rightSelectKeys.includes(it.value));
    handleChange(remainData);
    setRightSelectKeys([]);
  };

  return (
    <div styleName="transfer">
      <TransferItem
        {...leftOptions}
        dataSource={sourceData}
        checkedList={leftSelectKeys}
        setCheckedList={setLeftSelectKeys}
      />
      <TransferOperation
        operations={operations}
        disabled={[!leftSelectKeys.length, !rightSelectKeys.length]}
        toRight={toRight}
        toLeft={toLeft}
      />
      <TransferItem
        {...rightOptions}
        dataSource={targetData}
        checkedList={rightSelectKeys}
        setCheckedList={setRightSelectKeys}
      />
    </div>
  );
}

export default forwardRef(Transfer);
