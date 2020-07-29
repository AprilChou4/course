import React, { forwardRef, useState, useEffect, useCallback, useMemo } from 'react';
import { Table, Input, Button, Popconfirm, Form } from 'antd';
import AntdTable from '../AntdTable';
import EditableFormRow from './EditableFormRow';
import EditableCell from './EditableCell';

const EditableTable = forwardRef(({ columns, ...restProps }, ref) => {
  const isControlled = 'dataSource' in restProps; // 是否是受控的

  const [dataSource, setDataSource] = useState([]);

  const handleSave = useCallback(
    (row) => {
      const newData = [...dataSource];
      const index = newData.findIndex((item) => row.key === item.key);
      const item = newData[index];
      newData.splice(index, 1, {
        ...item,
        ...row,
      });
      setDataSource({ dataSource: newData });
    },
    [dataSource],
  );

  const clacColumns = useMemo(
    () =>
      columns.map((col) => {
        if (!col.editable) {
          return col;
        }
        return {
          ...col,
          onCell: (record) => ({
            record,
            editable: col.editable,
            dataIndex: col.dataIndex,
            title: col.title,
            handleSave,
          }),
        };
      }),
    [columns, handleSave],
  );

  const handleAdd = useCallback(() => {
    const { count, dataSource } = this.state;
    const newData = {
      key: count,
      name: `Edward King ${count}`,
      age: 32,
      address: `London, Park Lane no. ${count}`,
    };
    this.setState({
      dataSource: [...dataSource, newData],
      count: count + 1,
    });
  }, []);

  useEffect(() => {
    setDataSource(restProps.dataSource);
  }, [restProps.dataSource]);

  return (
    <>
      <Button onClick={handleAdd} type="primary" style={{ marginBottom: 16 }}>
        Add a row
      </Button>
      <AntdTable
        bordered
        ref={ref}
        columns={clacColumns}
        dataSource={dataSource}
        components={{
          body: {
            row: EditableFormRow,
            cell: EditableCell,
          },
        }}
      />
    </>
  );
});

export default EditableTable;
