import React, {
  forwardRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useImperativeHandle,
} from 'react';
import { Form, Input, Select, Row, Col, DatePicker } from 'antd';
import { connect } from 'nuomi';
import { isNil } from 'lodash';
import moment from 'moment';
import { get } from '@utils';

const { Item: FormItem } = Form;
const { Option: SelectOption, OptGroup: SelectOptGroup } = Select;
const { MonthPicker } = DatePicker;

const MonthFormat = 'YYYY-MM';
const formItemStyle = {
  width: '100%',
};
const formItemLayout = {
  labelCol: {
    sm: { span: 6 },
  },
  wrapperCol: {
    sm: { span: 18 },
  },
};
const vatTypeOptions = [
  {
    key: '0',
    title: '一般纳税人',
  },
  {
    key: '1',
    title: '小规模纳税人',
  },
];

const Content = (
  {
    form,
    form: { getFieldDecorator, setFieldsValue, getFieldValue },
    data: {
      record: { accountId },
    },
    dispatch,
  },
  ref,
) => {
  const [accountInfo, setAccountInfo] = useState({});
  const [accountingList, setAccountingList] = useState([]);
  const [systemAccount, setSystemAccount] = useState([]); // 系统预制的会计模板
  const [customAccount, setCustomAccount] = useState([]); // 用户自定义的会计模板
  const [curAccSubjectType, setCurAccSubjectType] = useState(''); // 会计科目的类型，0是"其他科目模板"，1是"预置"。（放在state里是因为无法在render的时候直接拿到）
  const accountingSubject = getFieldValue('accountingSubject');
  const isDisabledBusiness =
    !getFieldValue('subjectTemplateId') && ['6', '7'].includes(getFieldValue('accountingSubject')); // 是否禁用"会计工厂模式"（会计科目为个体工商户的时候，禁用业务形态的"会计工厂模式"）

  // 业务形态选项
  const businessPatternOptions = useMemo(() => {
    return [
      {
        key: '0',
        title: '经典包干模式',
      },
      {
        key: '1',
        title: '会计工厂模式',
        disabled: isDisabledBusiness,
      },
    ];
  }, [isDisabledBusiness]);

  // 获取会计科目列表
  const getSubjectTemplateList = useCallback(
    async (params = {}) => {
      const data = await dispatch({
        type: 'getSubjectTemplateList',
        payload: {
          type: 1,
          ...params,
        },
      });

      setSystemAccount(get(data, 'system', []));
      setCustomAccount(get(data, 'custom', []));
      return data;
    },
    [dispatch],
  );

  // 获取当前账套信息
  const getAccountInfo = useCallback(async () => {
    const data = await dispatch({
      type: 'getAccountInfo',
      payload: {
        accountId,
      },
    });
    if (!data) return;

    setAccountInfo(data);
    // eslint-disable-next-line no-nested-ternary
    setCurAccSubjectType(data.subjectTemplateId ? '0' : !isNil(data.accounting) ? '1' : '');
    return data;
  }, [accountId, dispatch]);

  // 获取记账会计
  const getAccountingList = useCallback(async () => {
    const data = await dispatch({
      type: 'getAccountingList',
    });
    setAccountingList(data || []);
    return data;
  }, [dispatch]);

  // 修改纳税性质时
  const handleVatTypeChange = useCallback(
    (value) => {
      getSubjectTemplateList({
        vatType: value,
      });
    },
    [getSubjectTemplateList],
  );

  // 会计科目改变时
  const handleAccountingSubjectChange = useCallback(
    (
      value,
      {
        props: {
          type,
          data: { accounting, subjectTemplateId, subjectTemplateName },
        },
      },
    ) => {
      setCurAccSubjectType(type); // 更新会计科目类型
      setFieldsValue({
        accounting,
        subjectTemplateId,
        subjectTemplateName,
      });
    },
    [setFieldsValue],
  );

  // 初始会计科目值
  const initialAccountingSubjectValue = useMemo(
    () => accountInfo.subjectTemplateId || accountInfo.accounting,
    [accountInfo.accounting, accountInfo.subjectTemplateId],
  );

  // 会计科目选项
  const accountingSubjectOptions = useMemo(
    () => [
      customAccount && (
        <SelectOptGroup key="0" label="其他科目模板">
          {customAccount.map((item) => (
            <SelectOption
              type="0"
              key={item.subjectTemplateId}
              style={{ display: item.status === '1' ? 'none' : 'block' }}
              disabled={item.status === '1'}
              data={{ ...item, subjectTemplateName: item.name }}
            >
              {item.name}
            </SelectOption>
          ))}
        </SelectOptGroup>
      ),
      systemAccount && (
        <SelectOptGroup key="1" label="预置">
          {systemAccount.map((item) => (
            <SelectOption
              type="1"
              key={item.accounting}
              style={{ display: item.status === '1' ? 'none' : 'block' }}
              data={{ ...item, subjectTemplateName: item.name }}
            >
              {item.name}
            </SelectOption>
          ))}
        </SelectOptGroup>
      ),
    ],
    [customAccount, systemAccount],
  );

  const getInitialData = useCallback(async () => {
    const [info, , accList] = await Promise.all([
      getAccountInfo(),
      getSubjectTemplateList(),
      getAccountingList(),
    ]);
    // 检查记账会计列表中是否有当前记账会计，如果没有从所有员工集合里去找
    if (accList.some((item) => item.staffId === info.bookkeepingAccounting)) {
      return;
    }

    const allEmployeeList = await dispatch({
      type: 'getAllEmployeeList',
    });
    if (!allEmployeeList) {
      return;
    }

    const employee =
      allEmployeeList.find((item) => item.staffId === info.bookkeepingAccounting) || {};
    setAccountingList((c) => [{ ...employee, hidden: true }, ...c]);
  }, [dispatch, getAccountInfo, getAccountingList, getSubjectTemplateList]);

  const subjectTemplateId = getFieldValue('subjectTemplateId');

  // 科目模板值或列表变化时候，如果"科目模板"列表中没有匹配到借口返回的值，则删除表单中该值
  useEffect(() => {
    if (
      !subjectTemplateId ||
      customAccount.some((item) => item.subjectTemplateId === subjectTemplateId)
    ) {
      return;
    }

    setFieldsValue({
      accountingSubject: undefined,
    });
  }, [subjectTemplateId, customAccount, setFieldsValue]);

  useEffect(() => {
    // 获取初始数据
    getInitialData();
  }, [getInitialData]);

  useEffect(() => {
    // 会计科目选择个体工商户时，禁用业务形态的"会计工厂模式"且业务形态更改为"经典包干模式"
    if (curAccSubjectType === '1' && ['6', '7'].includes(accountingSubject)) {
      setFieldsValue({
        businessPattern: '0',
      });
    }
  }, [accountingSubject, curAccSubjectType, setFieldsValue]);

  // 传给父组件
  useImperativeHandle(ref, () => ({ form }), [form]);

  return (
    <Form {...formItemLayout}>
      <Row gutter={12}>
        <Col span={24}>
          <FormItem
            label="账套名称"
            labelCol={{ sm: { span: 3 } }}
            wrapperCol={{ sm: { span: 21 } }}
          >
            {getFieldDecorator('accountName', {
              initialValue: accountInfo.accountName,
              // validateTrigger: 'onBlur',
              rules: [
                { required: true, message: '请输入正确的账套名称' },
                { whitespace: true, message: '账套名称不能为空' },
                { max: 100, message: '最大允许输入100个字符' },
              ],
            })(<Input allowClear placeholder="请输入账套名称" autoComplete="off" />)}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem label="纳税性质">
            {getFieldDecorator('vatType', {
              initialValue: `${
                isNil(accountInfo.vatType) || accountInfo.vatType === -1 ? '' : accountInfo.vatType
              }`,
              rules: [{ required: true, message: '请选择纳税性质' }],
            })(
              <Select onChange={handleVatTypeChange}>
                {vatTypeOptions.map(({ key, title }) => (
                  <SelectOption key={key}>{title}</SelectOption>
                ))}
              </Select>,
            )}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem label="建账时间">
            {getFieldDecorator('createTime', {
              initialValue: accountInfo.createTime ? moment(accountInfo.createTime) : undefined,
              rules: [{ required: true, message: '请选择建账时间' }],
            })(
              <MonthPicker
                placeholder="请选择建账时间"
                allowClear={false}
                style={formItemStyle}
                format={MonthFormat}
                disabled={!!accountInfo.hasAccountData}
              />,
            )}
          </FormItem>
        </Col>
        <Col span={24}>
          <FormItem
            label="会计科目"
            labelCol={{ sm: { span: 3 } }}
            wrapperCol={{ sm: { span: 21 } }}
          >
            {getFieldDecorator('accountingSubject', {
              initialValue: `${
                isNil(initialAccountingSubjectValue) ? '' : initialAccountingSubjectValue
              }`,
              rules: [{ required: true, message: '请选择会计科目' }],
            })(
              <Select
                showSearch
                placeholder="请选择会计科目"
                optionFilterProp="children"
                defaultActiveFirstOption={false}
                disabled={accountInfo.hasAccountData}
                onChange={handleAccountingSubjectChange}
              >
                {accountingSubjectOptions}
              </Select>,
            )}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem label="记账会计">
            {getFieldDecorator('bookkeepingAccounting', {
              initialValue: `${
                isNil(accountInfo.bookkeepingAccounting) ? '' : accountInfo.bookkeepingAccounting
              }`,
              rules: [{ required: true, message: '请选择记账会计' }],
            })(
              <Select
                showSearch
                placeholder="请选择记账会计"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().includes(input.toLowerCase())
                }
              >
                {accountingList.map(({ staffId, realName, hidden }, index) => (
                  <SelectOption
                    key={staffId || index}
                    disabled={!staffId}
                    style={{ display: hidden ? 'none' : 'block' }}
                  >
                    {realName}
                  </SelectOption>
                ))}
              </Select>,
            )}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem label="业务形态">
            {getFieldDecorator('businessPattern', {
              initialValue: `${
                isNil(accountInfo.businessPattern) ? '' : accountInfo.businessPattern
              }`,
              rules: [{ required: true, message: '请选择业务形态' }],
            })(
              <Select>
                {businessPatternOptions.map(({ key, title, disabled }) => (
                  <SelectOption key={key} disabled={disabled}>
                    {title}
                  </SelectOption>
                ))}
              </Select>,
            )}
          </FormItem>
        </Col>
      </Row>
      {getFieldDecorator('accounting', {
        initialValue: accountInfo.accounting,
      })(<Input type="hidden" />)}
      {getFieldDecorator('subjectTemplateId', {
        initialValue: accountInfo.subjectTemplateId,
      })(<Input type="hidden" />)}
      {getFieldDecorator('subjectTemplateName', {
        initialValue: accountInfo.subjectTemplateName,
      })(<Input type="hidden" />)}
    </Form>
  );
};

export default connect()(Form.create()(forwardRef(Content)));
