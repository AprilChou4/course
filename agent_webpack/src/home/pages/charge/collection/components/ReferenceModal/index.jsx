import React, { useMemo, useState } from 'react';
import { Modal, Select, Row, Col, message } from 'antd';
import { AntdTable, SuperSelect } from '@components';
import { connect } from 'nuomi';
import { getSelectOptions } from '@utils';
import { flatten } from 'lodash';
import columns from './columns';

const { Option } = Select;

const ReferenceModal = ({ isShowModal, referenceCustomerList, ysdList, skjhList, dispatch }) => {
  // 应收单编号
  const [ysdId, setYsdId] = useState();
  // 客户名称
  const [customerId, setCustomerId] = useState();
  // 选择表格行的keys
  const [selectedKeys, setSelectedKeys] = useState([]);
  // 客户列表
  const customerOptions = useMemo(
    () =>
      getSelectOptions(referenceCustomerList, (item) => ({
        value: item.customerId,
        name: item.customerName,
      })),
    [referenceCustomerList],
  );

  // 参照应收单获取明细回填
  const handleOk = async () => {
    if (!selectedKeys.length) {
      message.warn('请选择要参照的明细');
      return;
    }
    const idsArr = selectedKeys.map((key) => skjhList[key].planBillIds);
    const result = await dispatch({
      type: '$refrenceYsd',
      payload: { shouldReceiveId: ysdId, planBillIds: flatten(idsArr) },
    });
    if (result) {
      setYsdId();
      setSelectedKeys([]);
      setCustomerId([]);
    }
  };

  // 取消弹窗
  const handleCancel = () => {
    dispatch({
      type: 'updateState',
      payload: {
        isShowModal: false,
      },
    });
  };

  // 选择客户, 筛选出对应的应收单列表
  const handleCustomerChange = (value) => {
    setCustomerId(value);
    setYsdId();
    let current;
    if (value) {
      current = referenceCustomerList.find((item) => item.customerId === value);
    }
    dispatch({
      type: 'updateState',
      payload: {
        ysdList: value ? current.shouldReceiveBills : [],
        skjhList: [],
      },
    });
  };

  // 选择应收单编号后，筛选出收款计划
  const handleYsdIdChange = (value) => {
    setYsdId(value);
    dispatch({
      type: '$getplanDetailList',
      payload: value,
    });
  };

  // 选择表格行
  const handleRowSelectChange = (keys) => {
    setSelectedKeys(keys);
  };

  return (
    <Modal
      title="参照应收单"
      visible={isShowModal}
      width={957}
      onOk={handleOk}
      onCancel={handleCancel}
      getContainer={false}
    >
      <Row gutter={[50, 40]}>
        <Col span={12}>
          <span>客户名称：</span>
          <SuperSelect
            style={{ width: '85%' }}
            allowClear
            placeholder="请选择客户名称"
            value={customerId}
            onChange={handleCustomerChange}
          >
            {customerOptions}
          </SuperSelect>
        </Col>
        <Col span={12}>
          <span>应收单编号：</span>
          <SuperSelect
            style={{ width: '82%' }}
            placeholder="请选择应收单编号"
            value={ysdId}
            onChange={handleYsdIdChange}
            optionLabelProp="label"
            optionFilterProp="label"
          >
            {ysdList.map((item) => (
              <Option value={item.shouldReceiveId} key={item.shouldReceiveId} label={item.srbNo}>
                {item.srbNo}
                <span style={{ float: 'right', color: '#BFBFBF ' }}>
                  {item.totalShouldReceiveMoney}
                </span>
              </Option>
            ))}
          </SuperSelect>
        </Col>
      </Row>
      <AntdTable
        columns={columns}
        dataSource={skjhList}
        rowKey="index"
        bordered
        scroll={{ y: 430 }}
        rowSelection={{
          columnWidth: 40,
          onChange: handleRowSelectChange,
          selectedRowKeys: selectedKeys,
          getCheckboxProps: (record) => ({
            // 已收款状态不能参照
            disabled: record.receiveStatus === 1,
          }),
        }}
      />
    </Modal>
  );
};

export default connect(({ isShowModal, referenceCustomerList, ysdList, skjhList }) => ({
  isShowModal,
  referenceCustomerList,
  ysdList,
  skjhList,
}))(ReferenceModal);
