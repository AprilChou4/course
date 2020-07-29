import React, { forwardRef, useImperativeHandle } from 'react';
import { Form, Input } from 'antd';
import { DeptTreeSelect, LimitInput } from '@components';
import { get } from '@utils';

const { Item: FormItem } = Form;

const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};

const Content = forwardRef(({ data, form, form: { getFieldDecorator } }, ref) => {
  // 传给父组件
  useImperativeHandle(ref, () => ({ form }), [form]);

  return (
    <Form {...formItemLayout}>
      <FormItem label="上级部门">
        {getFieldDecorator('parentId', {
          initialValue: get(data, 'curDeptNodes.parentId'),
          rules: [{ required: true, message: '请选择上级部门' }],
        })(
          <DeptTreeSelect
            placeholder="请选择上级部门"
            getTreeNodeProps={(record) => ({
              key: record.deptId,
              value: record.deptId,
              title: record.name,
              disabled: record.code.startsWith(get(data, 'curDeptNodes.code')),
              style:
                record.name === '未分配'
                  ? {
                      display: 'none',
                    }
                  : {},
            })}
          />,
        )}
      </FormItem>
      <FormItem label="部门名称">
        {getFieldDecorator('deptName', {
          initialValue: get(data, 'curDeptNodes.name'),
          rules: [
            {
              required: true,
              whitespace: true,
              message: '部门名称不能为空',
            },
            {
              max: 50,
              message: '部门名称最大50个字符',
            },
          ],
        })(<LimitInput placeholder="请输入部门名称" maxLength={50} />)}
      </FormItem>
      {getFieldDecorator('deptId', {
        initialValue: get(data, 'curDeptKey'),
      })(<Input type="hidden" />)}
    </Form>
  );
});

export default Form.create()(Content);
