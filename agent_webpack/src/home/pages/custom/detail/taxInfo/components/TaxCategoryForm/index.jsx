import React, { useState } from 'react';
import classnames from 'classnames';
import { Form, Table, Select, Button } from 'antd';
import { connect, router } from 'nuomi';
import postMessageRouter from '@utils/postMessage';
import AddModal from './Modal';
import { ShowConfirm } from '@components';
import { getAdditionalIds } from './util';

import './style.less';

const { Option } = Select;
// 申报周期下拉框选项
const selectOpts = [
  { value: 1, label: '月报' },
  { value: 2, label: '季报' },
  { value: 3, label: '年报' },
  { value: 4, label: '半年' },
  { value: 5, label: '次报' },
];

const TaxCategoryInfo = ({
  form,
  isEditing,
  formTaxList,
  taxList,
  areaName,
  vatType,
  dispatch,
}) => {
  // #129516
  const { cszs: fromCszs } = router.location().query;

  const [modalVisible, setModalVisible] = useState(false);

  const { getFieldDecorator } = form;

  const additionalTaxIds = getAdditionalIds(areaName || '');

  // 新增税种前需校验纳税性质是否为空, 为空需跳转到基本信息填写
  const addNewTax = () => {
    if ((vatType !== null && vatType >= 0) || fromCszs) {
      setModalVisible(true);
      return;
    }
    ShowConfirm({
      width: 300,
      title: '温馨提示',
      content: '纳税性质为空，请前往基本信息中完善企业【纳税性质】信息',
      cancelText: '关闭',
      okText: '完善信息',
      onOk: async () => {
        // 内容被编辑，弹窗提示
        const result = await dispatch({
          type: `customer_detail_taxInfo/onLeave`,
        });
        if (result !== true && result !== undefined) return;
        const {
          query: { customerId },
        } = router.location();
        postMessageRouter({
          type: 'agentAccount/routerLocation',
          payload: {
            url: '/custom/detail/',
            query: {
              tab: 1,
              isEdit: 1,
              customerId,
              editVatType: 1,
            },
          },
        });
      },
    });
  };

  // 删除一条税种信息
  const onRemove = (deleteIds) => {
    const resultList = formTaxList.filter((item) => !deleteIds.includes(item.taxInfoId));
    form.resetFields();
    dispatch({
      type: 'updateState',
      payload: {
        formTaxList: resultList,
      },
    });
  };

  // 删除前确认
  const beforeRemove = (id) => {
    // 如果删除增值税，则警告，会删除附加税
    if (id === 1) {
      ShowConfirm({
        width: 300,
        title: '若删除增值税，附加税将一并被删除',
        content: '是否继续删除？',
        onOk() {
          const deleteIds = [...additionalTaxIds, 1];
          onRemove(deleteIds);
        },
      });
      return;
    }
    onRemove([id]);
  };

  // 申报周期改变，增值税和附加税 始终保持一致
  const onSelectChange = ({ taxInfoId }, value) => {
    if (taxInfoId === 1) {
      ShowConfirm({
        width: 300,
        title: '修改增值税纳税期限',
        content: '附加税等相关税种的纳税期限将同步修改',
        onOk() {
          formTaxList.forEach((item, index) => {
            if (additionalTaxIds.includes(item.taxInfoId)) {
              form.setFieldsValue({
                [`formTaxList[${index}].taxCycle`]: value,
              });
            }
          });
        },
        onCancel() {
          const index = formTaxList.findIndex((item) => item.taxInfoId === 1);
          form.setFieldsValue({
            [`formTaxList[${index}].taxCycle`]: value === 1 ? 2 : 1,
          });
        },
      });
    }
  };

  const columns = [
    {
      title: '序号',
      key: 'index',
      align: 'center',
      width: 50,
      render: (text, record, index) => {
        const idx = index + 1;
        return <span>{idx > 9 ? idx : `0${idx}`}</span>;
      },
    },
    {
      title: '税种选择',
      dataIndex: 'taxInfoId',
      key: 'taxInfoId',
      align: 'center',
      render: (text, record) => {
        const current = taxList.find((tax) => tax.taxInfoId === record.taxInfoId) || {};
        return <span>{current.taxName}</span>;
      },
    },
    {
      title: '申报周期',
      dataIndex: 'taxInfoId',
      key: 'taxCycle',
      align: 'center',
      width: 142,
      render: (text, record, index) => {
        const addedTax = formTaxList.find((item) => item.taxInfoId === 1);
        let taxCycle;
        if (addedTax && additionalTaxIds.includes(record.taxInfoId)) {
          taxCycle = String(addedTax.taxCycle);
        } else {
          const taxItem = taxList.find((tax) => tax.taxInfoId === record.taxInfoId) || {
            taxCycle: '1,2',
          };
          // eslint-disable-next-line
          taxCycle = taxItem.taxCycle;
        }
        const keys = taxCycle.split(',');
        // 过滤当前税种不支持的申报周期
        const taxCycleOptions = selectOpts.filter((it) => keys.includes(String(it.value)));
        // 如果taxCycle匹配不上，显示汉字 #131536
        let initialValue = record.taxCycle;
        if (!keys.includes(String(initialValue))) {
          // 找到匹配的项
          const matchItem = selectOpts.find((it) => it.value === record.taxCycle) || {};
          initialValue = matchItem.label;
        }
        return (
          <Form.Item>
            {getFieldDecorator(`formTaxList[${index}].taxCycle`, {
              initialValue,
            })(
              <Select
                placeholder="请选择申报周期"
                disabled={!isEditing}
                key={record.taxCycle}
                onChange={(value) => onSelectChange(record, value)}
                getPopupContainer={(triggerNode) => triggerNode.parentNode}
              >
                {taxCycleOptions.map((cycle) => (
                  <Option value={cycle.value} key={cycle.value}>
                    {cycle.label}
                  </Option>
                ))}
              </Select>,
            )}
          </Form.Item>
        );
      },
    },
    {
      title: '操作',
      width: 130,
      align: 'center',
      render: (text, record) => (
        <Button type="link" onClick={() => beforeRemove(record.taxInfoId)} disabled={!isEditing}>
          删除
        </Button>
      ),
    },
  ];

  return (
    <dl className={classnames('form-block', { 'from-disabled': !isEditing })}>
      <dt>税种信息</dt>
      <dd styleName="tax-category-table-wrap">
        {isEditing && (
          <Button type="link" onClick={addNewTax} styleName="add-btn">
            +新增
          </Button>
        )}
        <Table
          rowKey="taxInfoId"
          styleName="tax-category-table"
          bordered
          dataSource={formTaxList}
          pagination={false}
          columns={columns}
        />
        <AddModal visible={modalVisible} onCancel={() => setModalVisible(false)} />
      </dd>
    </dl>
  );
};

const mapStateToProps = ({ isEditing, formTaxList, formParams, taxList }) => ({
  formTaxList,
  isEditing,
  taxList,
  areaName: formParams.areaName,
  vatType: formParams.vatType,
});

export default connect(mapStateToProps, null, null, { withRef: true })(
  Form.create({
    async onValuesChange(props, changedFields, allFields) {
      const resultList = props.formTaxList.map((item, index) => ({
        ...item,
        ...allFields.formTaxList[index],
      }));
      props.dispatch({
        type: 'updateState',
        payload: {
          formTaxList: resultList,
        },
      });
    },
  })(TaxCategoryInfo),
);
