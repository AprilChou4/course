import React, {
  forwardRef,
  useState,
  useContext,
  useEffect,
  useCallback,
  useMemo,
  useImperativeHandle,
  useLayoutEffect,
} from 'react';
import { Form, Input, Select } from 'antd';
import { connect } from 'nuomi';

const { Item: FormItem } = Form;
const { Option: SelectOption } = Select;

const Content = (
  {
    form,
    form: { getFieldDecorator },
    data: {
      record: { recordId },
    },
    dispatch,
  },
  ref,
) => {
  const [accountingList, setAccountingList] = useState([]);
  const [repeatList, setRepeatList] = useState([]);

  const checkAccountName = useCallback(async () => {
    const list = await dispatch({
      type: 'checkAccountName',
      payload: {
        recordId,
      },
    });
    setRepeatList(list || []);
  }, [dispatch, recordId]);

  useEffect(() => {
    checkAccountName();
  }, [checkAccountName]);

  const getAccountingList = useCallback(async () => {
    const list = await dispatch({
      type: 'getAccountingList',
    });
    setAccountingList(list || []);
  }, [dispatch]);

  useEffect(() => {
    getAccountingList();
  }, [getAccountingList]);

  // 传给父组件
  useImperativeHandle(ref, () => ({ form }), [form]);

  return (
    <Form layout="vertical">
      {Boolean(repeatList && repeatList.length) && (
        <>
          <p>账套名称重复，请修改</p>
          {repeatList.map(({ accountId, accountName }, index) => (
            <FormItem label={`将“${accountName}”修改为：`} key={accountId || index}>
              {getFieldDecorator(`accountName-${accountId}`, {
                rules: [{ required: true, message: '请输入账套名称' }],
              })(
                <Input
                  allowClear
                  placeholder="请输入账套名称"
                  autoComplete="off"
                  disabled={!accountId}
                />,
              )}
            </FormItem>
          ))}
        </>
      )}
      <FormItem label="记账会计">
        {getFieldDecorator('bookkeepingAccounting', {
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
            {accountingList.map(({ staffId, realName }, index) => (
              <SelectOption key={staffId || index} disabled={!staffId}>
                {realName}
              </SelectOption>
            ))}
          </Select>,
        )}
      </FormItem>
    </Form>
  );
};

export default connect()(Form.create()(forwardRef(Content)));
