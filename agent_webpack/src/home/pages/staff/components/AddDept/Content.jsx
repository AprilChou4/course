import React, { forwardRef, useState, useCallback, useImperativeHandle } from 'react';
import { Form, Input } from 'antd';
import { DeptTreeSelect } from '@components';
import { get, trim } from '@utils';
import styles from './style.less';

const { Item: FormItem } = Form;
const { TextArea } = Input;

const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};

const Content = forwardRef(({ data, form, form: { getFieldDecorator } }, ref) => {
  const [deptCount, setDeptCount] = useState(0);
  // 传给父组件
  useImperativeHandle(ref, () => ({ form }), [form]);

  const handleDeptNamesChange = useCallback((e) => {
    const { value } = e.target;
    setDeptCount(value.split('\n').filter((val) => trim(val)).length);
  }, []);

  const deptNamesValidator = useCallback((rule, value, callback) => {
    // 验证空字段
    if (!value || !trim(value)) {
      callback('新增部门名称不能为空');
      return;
    }

    if (value.split('\n').filter((val) => trim(val)).length > 1000) {
      callback('批量新增部门数量最多1000个');
      return;
    }

    callback();
  }, []);

  return (
    <Form {...formItemLayout}>
      <FormItem label="上级部门">
        {getFieldDecorator('parentId', {
          initialValue: get(data, 'curDeptKey'),
          rules: [{ required: true, message: '请选择上级部门' }],
        })(<DeptTreeSelect hideUnassigned placeholder="请选择上级部门" />)}
      </FormItem>
      <FormItem label="新增部门名称" className={styles.deptNames}>
        {getFieldDecorator('deptNames', {
          rules: [
            {
              validator: deptNamesValidator,
            },
          ],
        })(
          <TextArea placeholder="请输入或复制部门名称" rows={8} onChange={handleDeptNamesChange} />,
        )}
        <span className={styles.deptCount}>共 {deptCount} 个部门</span>
      </FormItem>
    </Form>
  );
});

export default Form.create()(Content);
