import React, { forwardRef, useState, useEffect, useCallback, useImperativeHandle } from 'react';
import { connect } from 'nuomi';
import { Form, Radio, Row, Col } from 'antd';
import classnames from 'classnames';
import { AntdInput, LimitInput } from '@components';
import { get, isNil, regex } from '@utils';
import styles from './style.less';

const { Item: FormItem } = Form;
const { Group: RadioGroup } = Radio;

const formItemLayoutHalf = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

const sexOptions = [
  { label: '男', value: 'M' },
  { label: '女', value: 'W' },
];

const Content = forwardRef(
  ({ data: propsData, form, form: { getFieldDecorator, setFieldsValue }, dispatch }, ref) => {
    // 注册隐藏域
    getFieldDecorator('staffId');

    const [initData, setInitData] = useState(() => ({
      sex: 'M',
      staffId: get(propsData, 'record.staffId'),
    }));

    const getStaffInfo = useCallback(
      async ({ staffId }) => {
        const staffInfo = await dispatch({
          type: 'getStaffInfo',
          payload: {
            staffId,
          },
        });

        if (isNil(staffInfo)) {
          return;
        }

        const { realName, iDNumber, phoneNum, sex } = staffInfo || {};

        setInitData({
          staffId,
          realName,
          sex,
          phoneNum,
          iDNumber,
        });
      },
      [dispatch],
    );

    useEffect(() => {
      const staffId = get(propsData, 'record.staffId', '');
      getStaffInfo({ staffId });
    }, [getStaffInfo, propsData]);

    // 使用form.setFieldsValue()设置初始值，这样初始的数据也能监听到
    useEffect(() => {
      setFieldsValue(initData);
    }, [setFieldsValue, initData]);

    // 传给父组件
    useImperativeHandle(ref, () => ({ form, initData }), [form, initData]);

    return (
      <Form className={classnames('section-form', styles.form, styles['form-addEditStaff'])}>
        <>
          <dl>
            <dt>基本信息</dt>
            <dd>
              <Row>
                <Col span={12}>
                  <FormItem label="姓名" {...formItemLayoutHalf}>
                    {getFieldDecorator('realName', {
                      rules: [
                        {
                          required: true,
                          whitespace: true,
                          message: '员工姓名不能为空',
                        },
                        {
                          max: 15,
                          message: '姓名最大15个字符',
                        },
                      ],
                    })(<LimitInput placeholder="请输入姓名" maxLength={15} />)}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem label="性别" {...formItemLayoutHalf}>
                    {getFieldDecorator('sex', {
                      rules: [{ required: true, message: '请选择性别' }],
                    })(<RadioGroup options={sexOptions} />)}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <FormItem required label="手机号码" {...formItemLayoutHalf}>
                    {getFieldDecorator('phoneNum')(
                      <AntdInput allowClear disabled placeholder="请输入手机号码" />,
                    )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem label="身份证号" {...formItemLayoutHalf}>
                    {getFieldDecorator('iDNumber', {
                      rules: [
                        {
                          pattern: regex.idcard,
                          message: '身份证号必须15或18位数字字母',
                        },
                      ],
                    })(<AntdInput allowClear placeholder="请输入身份证号" />)}
                  </FormItem>
                </Col>
              </Row>
            </dd>
          </dl>
        </>
      </Form>
    );
  },
);

export default connect()(Form.create()(Content));
