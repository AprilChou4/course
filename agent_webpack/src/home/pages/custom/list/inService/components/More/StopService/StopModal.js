// 停滞客户弹窗
import React, { useCallback, useState } from 'react';
import { Modal, Form, Radio, Input, Spin } from 'antd';
import { connect } from 'nuomi';
import Style from './style.less';

const FormItem = Form.Item;
const StopModal = (props) => {
  const {
    dispatch,
    loadings,
    stopVisible,
    selectedRowKeys,
    form: { getFieldDecorator },
  } = props;

  const [stopValue, setStopValue] = useState(1); // 单选框值
  const [stopReason, setStopReason] = useState('更换其他代理机构'); // 停止原因

  const radioList = [
    {
      key: 1,
      name: '更换其他代理机构',
    },
    {
      key: 2,
      name: '企业聘请专职会计',
    },
    {
      key: 3,
      name: '企业破产倒闭',
    },
    {
      key: 4,
      name: '其他',
    },
  ];

  //   弹窗取消
  const onCancel = useCallback(() => {
    dispatch({
      type: 'updateState',
      payload: {
        stopVisible: false,
      },
    });
  }, [dispatch]);

  // 弹窗确认
  const onOk = useCallback(() => {
    dispatch({
      type: '$stopCustomer',
      payload: {
        customerIdList: selectedRowKeys,
        stopReason,
      },
    });
  }, [dispatch, selectedRowKeys, stopReason]);

  // 改变单选框
  const changeRadio = useCallback((e) => {
    const { value, option } = e.target;
    setStopValue(value);
    setStopReason(value === 4 ? '' : option.name);
  }, []);

  // 改变Input框
  const changeInput = useCallback((e) => {
    setStopReason(e.target.value);
  }, []);

  return (
    <Modal
      visible={stopVisible}
      width={460}
      className={Style['m-stopModal']}
      title="停止服务原因"
      centered
      onOk={onOk}
      onCancel={onCancel}
    >
      <Spin spinning={!!loadings.$stopCustomer}>
        <Form wrapperCol={{ sm: { span: 24 } }}>
          <FormItem>
            {getFieldDecorator('radioVal', {
              initialValue: stopValue,
            })(
              <Radio.Group onChange={changeRadio}>
                {radioList.map((item) => (
                  <Radio value={item.key} key={item.key} option={item}>
                    {item.name}
                  </Radio>
                ))}
              </Radio.Group>,
            )}
          </FormItem>
          {stopValue === 4 && (
            <FormItem>
              {getFieldDecorator('stopReason')(
                <Input
                  style={{ width: 340, marginLeft: 10 }}
                  placeholder="请输入其他原因"
                  autoComplete="off"
                  onChange={changeInput}
                />,
              )}
            </FormItem>
          )}
        </Form>
      </Spin>
    </Modal>
  );
};
export default connect(({ loadings, stopVisible, selectedRowKeys }) => ({
  loadings,
  stopVisible,
  selectedRowKeys,
}))(Form.create()(StopModal));
