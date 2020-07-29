import React, {
  forwardRef,
  useState,
  useContext,
  useEffect,
  useLayoutEffect,
  useCallback,
  useMemo,
  useImperativeHandle,
} from 'react';
import { Form, Select } from 'antd';
import './style.less';

const { Item: FormItem } = Form;
const { Option: SelectOption } = Select;

const Content = ({ form, form: { getFieldDecorator }, dispatch }, ref) => {
  const [unCreateCustomerList, setUnCreateCustomerList] = useState([]);

  const getUnCreateCustomer = useCallback(async () => {
    const data = await dispatch({
      type: 'getUnCreateCustomer',
    });
    setUnCreateCustomerList(data || []);
  }, [dispatch]);

  useEffect(() => {
    getUnCreateCustomer();
  }, [getUnCreateCustomer]);

  // 传给父组件
  useImperativeHandle(ref, () => ({ form, unCreateCustomerList }), [form, unCreateCustomerList]);

  return (
    <>
      <p>您所需要恢复的账套与记账平台的账套名称重复，请选择您账套所需要恢复的客户名称</p>
      <Form layout="vertical">
        <FormItem
          label={
            <span>
              客户名称
              {!unCreateCustomerList.length && (
                <span styleName="warning">您没有可建账的客户，请先到客户管理中新增客户</span>
              )}
            </span>
          }
        >
          {getFieldDecorator('customerId', {
            rules: [{ required: true, message: '请选择客户名称' }],
          })(
            <Select
              showSearch
              disabled={!unCreateCustomerList.length}
              placeholder="请选择您账套所需要恢复的客户名称"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.props.children.toLowerCase().includes(input.toLowerCase())
              }
            >
              {unCreateCustomerList.map(({ customerId, customerName }) => (
                <SelectOption key={customerId}>{customerName}</SelectOption>
              ))}
            </Select>,
          )}
        </FormItem>
      </Form>
    </>
  );
};
export default Form.create()(forwardRef(Content));
