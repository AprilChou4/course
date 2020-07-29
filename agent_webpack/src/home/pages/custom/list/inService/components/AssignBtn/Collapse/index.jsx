// 收起、展开伸缩框
import React from 'react';
import { Tag } from 'antd';
import { connect } from 'nuomi';
import CollapseItem from '@components/CollapseItem';
import Style from './style.less';

const Collapse = ({ dispatch, selectedRows, selectedRowKeys }) => {
  const close = (customerId) => {
    dispatch({
      type: 'updateState',
      payload: {
        selectedRows: selectedRows.filter((v) => v.customerId !== customerId),
        selectedRowKeys: selectedRowKeys.filter((v) => v !== customerId),
      },
    });
  };
  const getContent = (selectList) => {
    return (
      <div className={Style['m-list']}>
        {selectList.map((item) => (
          <Tag closable key={item.customerId} onClose={() => close(item.customerId)}>
            {item.customerName}
          </Tag>
        ))}
      </div>
    );
  };

  return (
    <>
      {selectedRows.length &&
        (selectedRows.length > 1 ? (
          <CollapseItem
            getContent={() => getContent(selectedRows)}
            header={`共选择${selectedRows.length}个客户`}
          />
        ) : (
          <div className={Style['m-single']}>{selectedRows[0].customerName}</div>
        ))}
    </>
  );
};
export default connect(({ selectedRows, selectedRowKeys }) => ({ selectedRows, selectedRowKeys }))(
  Collapse,
);
