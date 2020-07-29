import React, { forwardRef, useImperativeHandle } from 'react';
import { Form } from 'antd';
import classnames from 'classnames';
import { Iconfont, DeptTreeSelect } from '@components';
import { get } from '@utils';
import styles from './style.less';

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
  getFieldDecorator('staffId', { initialValue: get(data, 'record.staffId') });
  // 传给父组件
  useImperativeHandle(ref, () => ({ form }), [form]);

  return (
    <>
      <p className={classnames('f-tac', styles.title)}>
        <Iconfont code="&#xeaa1;" />
        温馨提示：员工历史所在部门已被删除，请重新选择部门
      </p>
      <Form className={styles.form} {...formItemLayout}>
        <FormItem label="部门名称">
          {getFieldDecorator('deptIds', {
            rules: [{ required: true, message: '请选择部门' }],
          })(<DeptTreeSelect />)}
        </FormItem>
      </Form>
    </>
  );
});

export default Form.create()(Content);
