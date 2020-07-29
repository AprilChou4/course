import React, { useState, useRef } from 'react';
import { InputNumber, Button } from 'antd';
import FormTable from '@components/FormTable';

export default () => {
  const form = useRef();

  const [dataSource, setSource] = useState([
    {
      id: 'a',
      count: 1,
      age: 18,
      sex: '女',
      salary: 1000,
    },
    {
      id: 'c',
      count: 2,
      age: 18,
      sex: '男',
      salary: 3000,
    },
  ]);

  const handleChange = (record, value) => {
    form.current.setFieldsValue({
      [`${record.id}.age`]: value * 2,
    });
    // console.log('改变', record, value);
  };
  const columns = [
    {
      title: 'count',
      dataIndex: 'count',
      key: 1,
      rules: [{ required: true, message: '请选择客户名称' }],
      render(text, record) {
        return <InputNumber onChange={(value) => handleChange(record, value)} />;
      },
      width: 100,
    },
    {
      title: 'age',
      dataIndex: 'age',
      key: 2,
      render() {
        return <InputNumber />;
      },
      width: 300,
    },
    {
      title: 'sex',
      dataIndex: 'sex',
      key: 3,
      // render() {
      //   // onChange={(value) => handleChange(record, value)}
      //   return <span>男</span>;
      // },
    },
    {
      title: 'salary',
      dataIndex: 'salary',
      key: 4,
    },
  ];

  const hanldleValidate = () => {
    form.current.validateFields((err, values) => {
      if (err) return;
      console.log('表单1：', values);
    });
    form.current.validateFields([1], (err, values) => {
      if (err) return;
      console.log('表单2：', values);
    });
  };

  const hanldleClick = () => {
    console.log(form.current.getFieldsValue());
    console.log(form.current.getFieldsValue([1]));
    console.log(form.current.getFieldsValue(0));
    console.log(form.current.getFieldValue(0, 'salary'));
  };

  const hanldleSet = () => {
    form.current.setFieldsValue({
      'a.count': 999,
      'c.age': 1000,
    });
  };

  return (
    <>
      <div style={{ height: 200 }}>
        <FormTable
          getForm={(f) => {
            form.current = f;
          }}
          columns={columns}
          dataSource={dataSource}
          rowKey="id"
        />
      </div>
      <Button onClick={hanldleClick}>获取表单</Button>
      &nbsp;
      <Button onClick={hanldleValidate}>校验表单</Button>
      &nbsp;
      <Button onClick={hanldleSet}>设置表单</Button>
    </>
  );
};
