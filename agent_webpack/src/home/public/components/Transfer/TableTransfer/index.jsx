import React from 'react';
import PropTypes from 'prop-types';
import { Transfer, Table } from 'antd';
import { difference } from 'lodash';
import classnames from 'classnames';
import './style.less';

const TableTransfer = ({
  tableOptions: {
    className: tableClassName,
    rowClassName,
    leftColumns,
    rightColumns,
    columns: allColumns,
    ...restTableOptions
  },
  showSearch,
  customSearch,
  ...restProps
}) => {
  if (customSearch && showSearch) {
    console.warn('customSearch与showSearch不能共存，优先使用customSearch！');
  }
  return (
    <Transfer showSelectAll={false} {...restProps} showSearch={showSearch && !customSearch}>
      {(props) => {
        const {
          direction,
          filteredItems,
          onItemSelectAll,
          onItemSelect,
          selectedKeys: listSelectedKeys,
          disabled: listDisabled,
        } = props;
        const columns = (direction === 'left' ? leftColumns : rightColumns) || allColumns;
        const rowSelection = {
          getCheckboxProps: (item) => ({
            disabled: listDisabled || item.disabled,
          }),
          onSelectAll(selected, selectedRows) {
            const treeSelectedKeys = selectedRows
              .filter((item) => !item.disabled)
              .map(({ key }) => key);
            const diffKeys = selected
              ? difference(treeSelectedKeys, listSelectedKeys)
              : difference(listSelectedKeys, treeSelectedKeys);
            onItemSelectAll(diffKeys, selected);
          },
          onSelect({ key }, selected) {
            onItemSelect(key, selected);
          },
          selectedRowKeys: listSelectedKeys,
        };
        const tableDataSource =
          customSearch && direction === 'left'
            ? restProps.dataSource.map((item) => {
                return {
                  ...item,
                  disabled: item.disabled || restProps.targetKeys.includes(item.key),
                };
              })
            : filteredItems;
        return (
          <div>
            {Boolean(customSearch) && <div style={{ marginBottom: 8 }}>{customSearch}</div>}
            <Table
              {...restTableOptions}
              rowSelection={rowSelection}
              // pagination={{
              //   pageSize: 10,
              // }}
              columns={columns}
              dataSource={tableDataSource}
              size="small"
              style={{ pointerEvents: listDisabled ? 'none' : null }}
              onRow={({ key, disabled: itemDisabled }) => ({
                onClick: () => {
                  if (itemDisabled || listDisabled) return;
                  onItemSelect(key, !listSelectedKeys.includes(key));
                },
              })}
              className={classnames(
                tableClassName,
                `ant-transfer-table ant-transfer-table-${direction}`,
              )}
              rowClassName={(record) =>
                classnames(
                  rowClassName,
                  `ant-transfer-table-tr ant-transfer-table-tr-${direction}`,
                  { 'ant-transfer-table-tr-disabled': record.disabled },
                )
              }
            />
          </div>
        );
      }}
    </Transfer>
  );
};

TableTransfer.defaultProps = {
  tableOptions: {
    leftColcolumnsumns: {
      dataIndex: 'name',
      title: '名称',
    },
  },
};
TableTransfer.propTypes = {
  tableOptions: PropTypes.object, // Table的options
};

export default TableTransfer;
