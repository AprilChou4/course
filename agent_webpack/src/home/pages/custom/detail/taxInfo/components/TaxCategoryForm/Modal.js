import React, { useState } from 'react';
import { Modal, Form, Select } from 'antd';
import { connect } from 'nuomi';
import { ShowConfirm } from '@components';
import { getDefaultTaxCycle, getAdditionalIds } from './util';

import './modal.less';

const { Option } = Select;

const AddModal = ({
  form,
  visible,
  onCancel,
  taxList,
  vatType,
  formTaxList,
  areaName,
  dispatch,
}) => {
  const additionalTaxIds = getAdditionalIds(areaName || '');
  // 税种对应可选择的申报周期
  const [optionKeys, setOptionKeys] = useState(['1', '2']);
  // 切换税种
  const onChange = (id) => {
    // 存在增值税，附加税的申报周期与增值税相同，下拉框只有一个选项。
    const addedTax = formTaxList.find((item) => item.taxInfoId === 1);

    let taxCycle;
    if (addedTax && additionalTaxIds.includes(id)) {
      // 存在增值税
      taxCycle = String(addedTax.taxCycle);
    } else {
      const taxItem = taxList.find((tax) => tax.taxInfoId === id) || { taxCycle: '1,2' };
      // eslint-disable-next-line
      taxCycle = taxItem.taxCycle;
    }
    // 设置可选择的申报周期
    setOptionKeys(taxCycle.split(','));

    // 设置默认申报周期,
    form.setFieldsValue({
      taxCycle: getDefaultTaxCycle(id, vatType, addedTax ? addedTax.taxCycle : undefined, areaName),
    });
  };

  // 提交
  const onSubmit = () => {
    form.validateFields(async (err, values) => {
      if (!err) {
        const resultList = [...formTaxList, values];
        dispatch({
          type: 'updateState',
          payload: {
            formTaxList: resultList,
          },
        });
        form.resetFields();
        onCancel();
      }
    });
  };

  // 提交前确认
  const beforeSubmit = () => {
    form.validateFields(async (err, values) => {
      if (err) return;
      // 企业所得税（查账征收）与 企业所得税（核定征收）不并存
      const isQysds = values.taxInfoId === 6 || values.taxInfoId === 13;
      const isHasQysds = formTaxList.find((item) => item.taxInfoId === 6 || item.taxInfoId === 13);
      const message = values.taxInfoId === 13 ? '查账征收' : '核定征收';
      if (isQysds && isHasQysds) {
        ShowConfirm({
          width: 300,
          title: `您已经是${message}`,
          content: '如需修改，请删除列表中的企业所得税',
          type: 'warning',
          okText: '知道了',
        });
        return;
      }
      // 未添加增值税 且 当前是附加税
      const addedTax = formTaxList.find((item) => item.taxInfoId === 1);
      if (!addedTax && additionalTaxIds.includes(values.taxInfoId)) {
        ShowConfirm({
          width: 300,
          title: '您尚未选择增值税',
          content: '不可添加附加税',
          type: 'warning',
          okText: '知道了',
        });
        return;
      }
      onSubmit(values);
    });
  };

  // 过滤掉已经选择的税种
  const selectedIds = formTaxList.map((it) => it.taxInfoId);
  const selectList = taxList.filter(({ taxInfoId }) => !selectedIds.includes(taxInfoId));

  const { getFieldDecorator } = form;
  const formItemLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 19 },
  };
  return (
    <Modal
      centered
      wrapClassName="tax-category-add-modal"
      title="新增税种信息"
      visible={visible}
      onCancel={onCancel}
      width={355}
      onOk={beforeSubmit}
    >
      <Form hideRequiredMark layout="horizontal">
        <Form.Item label="税种选择" {...formItemLayout}>
          {getFieldDecorator('taxInfoId', {
            rules: [{ required: true, message: '请选择税种' }],
          })(
            <Select placeholder="请选择税种" onChange={onChange}>
              {selectList.map((tax) => (
                <Option key={tax.taxInfoId} value={tax.taxInfoId}>
                  {tax.taxName}
                </Option>
              ))}
            </Select>,
          )}
        </Form.Item>
        <Form.Item label="申报周期" {...formItemLayout}>
          {getFieldDecorator('taxCycle', {
            rules: [{ required: true, message: '请选择申报周期' }],
          })(
            <Select placeholder="请选择申报周期">
              {optionKeys.includes('5') && <Option value={5}>次报</Option>}
              {optionKeys.includes('1') && <Option value={1}>月报</Option>}
              {optionKeys.includes('2') && <Option value={2}>季报</Option>}
              {optionKeys.includes('4') && <Option value={4}>半年</Option>}
              {optionKeys.includes('3') && <Option value={3}>年报</Option>}
            </Select>,
          )}
        </Form.Item>
      </Form>
    </Modal>
  );
};

const mapStateToProps = ({ taxList, formTaxList, formParams }) => ({
  formTaxList,
  taxList,
  vatType: formParams.vatType,
  areaName: formParams.areaName,
});

export default connect(mapStateToProps)(Form.create()(AddModal));
