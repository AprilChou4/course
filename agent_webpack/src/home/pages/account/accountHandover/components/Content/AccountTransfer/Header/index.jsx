import React, { useState, useEffect, useCallback } from 'react';
import { Form, Button, Input, Select, Row, Col } from 'antd';
import { connect } from 'nuomi';
import { useDebouncedCallback } from 'use-debounce';
import { get } from '@utils';
import Submit from './Submit';
import './style.less';

const { Item: FormItem } = Form;
const { Option: SelectOption } = Select;
const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19 },
};

const Header = ({
  allAccounts,
  form: { getFieldDecorator, setFieldsValue, validateFields, resetFields },
  dispatch,
}) => {
  const [nameHelp, setNameHelp] = useState('');
  const [companyList, setCompanyList] = useState([]);

  // 清空页面上相关信息
  const clearInfo = () => {
    setNameHelp('');
    setCompanyList([]);
  };

  const afterSubmit = useCallback(() => {
    resetFields();
    clearInfo();
  }, [resetFields]);

  // 加个防抖
  const [nameValidator] = useDebouncedCallback(async (rule, value, callback) => {
    if (!value) {
      clearInfo();
      callback();
      return;
    }
    const res = await dispatch({
      type: 'checkUser',
      payload: {
        name: value,
      },
    });
    if (!res) {
      clearInfo();
      callback();
      return;
    }

    const status = get(res, 'status');
    const data = get(res, 'data', []);
    const message = get(res, 'message', '');
    if (status === 300) {
      clearInfo();
      callback(message);
      return;
    }
    if (!data.length) {
      clearInfo();
      callback('未找到用户信息');
      return;
    }

    const { username = '', realName = '' } = get(data, '[0]', {});
    const name = username || realName;
    const text = name ? `*${name.slice(1, name.lenghth)}` : '';
    setNameHelp(text);
    setCompanyList(data);
    callback();
  }, 300);

  const handleCompanyChange = useCallback(
    (value, { props: { dataref } }) => {
      setFieldsValue({
        companyData: dataref,
      });
    },
    [setFieldsValue],
  );

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      validateFields((err, values) => {
        if (err) {
          return;
        }
        dispatch({
          type: 'updateTransferSubmit',
          payload: {
            visible: true,
            submitData: values,
          },
        });
      });
    },
    [dispatch, validateFields],
  );

  const getAllAccounts = useCallback(async () => {
    dispatch({
      type: 'getAllAccounts',
    });
  }, [dispatch]);

  useEffect(() => {
    getAllAccounts();
  }, [getAllAccounts]);

  return (
    <>
      <Form {...formItemLayout} onSubmit={handleSubmit}>
        <Row>
          <Col span={10}>
            <FormItem label="接收人" help={nameHelp || undefined} styleName="name">
              {getFieldDecorator('name', {
                rules: [
                  { required: true, message: '请输入接收人' },
                  {
                    validator: nameValidator,
                  },
                ],
              })(<Input allowClear placeholder="请输入接收人手机号/用户名" autoComplete="off" />)}
            </FormItem>
            {Boolean(companyList && companyList.length > 1) && (
              <FormItem
                label="企业名称"
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
                styleName="company"
              >
                {getFieldDecorator('staffId-companyId', {
                  initialValue: `${companyList[0].staffId || ''}-${companyList[0].companyId || ''}`,
                  rules: [{ required: true, message: '请选择企业名称' }],
                })(
                  <Select
                    showSearch
                    placeholder="请选择企业名称"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.props.children.toLowerCase().includes(input.toLowerCase())
                    }
                    onChange={handleCompanyChange}
                  >
                    {companyList.map((item) => (
                      <SelectOption
                        key={`${item.staffId || ''}-${item.companyId || ''}`}
                        dataref={item}
                      >
                        {item.companyname}
                      </SelectOption>
                    ))}
                  </Select>,
                )}
              </FormItem>
            )}
            {getFieldDecorator('companyData', {
              initialValue: companyList[0] || {},
            })(<Input type="hidden" />)}
          </Col>
          <Col span={10}>
            <FormItem label="账套" styleName="accountList">
              {getFieldDecorator('accountList', {
                rules: [{ required: true, message: '请选择账套' }],
              })(
                <Select
                  allowClear
                  labelInValue
                  mode="multiple"
                  placeholder="请选择账套"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.props.children.toLowerCase().includes(input.toLowerCase())
                  }
                >
                  {allAccounts.map(({ accountId, accountName }, index) => (
                    <SelectOption key={accountId || index} disabled={!accountId}>
                      {accountName}
                    </SelectOption>
                  ))}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col offset={1} span={3}>
            <FormItem wrapperCol={{ span: 24 }} style={{ textAlign: 'right' }}>
              <Button type="primary" htmlType="submit">
                移交
              </Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <Submit afterSubmit={afterSubmit} />
    </>
  );
};

export default connect(({ allAccounts }) => ({ allAccounts }))(Form.create()(Header));
