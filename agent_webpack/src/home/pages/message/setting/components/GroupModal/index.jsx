import React, { useEffect, useState, useRef } from 'react';
import { Modal, Form, Button, message } from 'antd';
import { connect } from 'nuomi';
import { InputLimit } from '@components/InputLimit';
import Transfer from '../Transfer';
import searchInput from './searchInput';

import './index.less';

function TheModal(props) {
  const {
    form,
    isShowModal,
    currentEditItem,
    customerList,
    customerTotal,
    customerParams,
    builtInGroupList,
    addLoading,
    updateLoading,
    dispatch,
  } = props;

  // transfer 使用到的
  const [targetData, setTargetData] = useState([]);
  // 是否没有选择客户
  const [isCustomerErr, setCustomerErr] = useState(false);
  // transfer 引用
  const tranferRef = useRef();

  // useEffect(() => {
  // const keys = currentEditItem ? currentEditItem.customers.map((it) => it.customerId) : [];
  // setTargetKeys(keys);
  // }, [currentEditItem]);

  useEffect(() => {
    const data = currentEditItem
      ? currentEditItem.customers.map((it) => ({
          label: it.customerName,
          value: it.customerId,
        }))
      : [];
    setTargetData(data);
  }, [currentEditItem]);

  useEffect(() => {
    if (isShowModal && !customerList.length) {
      dispatch({
        type: 'getCustomerList',
        payload: {},
      });
    }
  }, [customerList.length, dispatch, isShowModal]);

  // 关闭弹窗，需要重置表单
  const closeModal = () => {
    tranferRef.current.resetValues();
    form.resetFields();
    setTargetData([]);
    setCustomerErr(false);
    dispatch({
      type: 'updateState',
      payload: {
        isShowCustomerModal: false,
        currentGroup: undefined,
        customerParams: {
          ...customerParams,
          current: 1,
          customerName: '',
        },
      },
    });
  };

  // 增加、修改提交
  const onSubmit = async (values) => {
    const type = currentEditItem ? '$updateGroup' : '$addGroup';
    const res = await dispatch({
      type,
      payload: {
        groupId: currentEditItem ? currentEditItem.groupId : undefined,
        ...values,
        customerIdList: targetData.map((i) => i.value),
      },
    });
    if (!res) {
      message.success('添加成功！');
      dispatch({
        type: '$getGroupList',
        payload: {},
      });
      closeModal();
    } else {
      message.error(res);
    }
  };

  // 提交，检验必填项
  const onValidate = () => {
    form.validateFields(async (err, values) => {
      if (!targetData.length) {
        setCustomerErr(true);
        return;
      }
      if (!err) {
        onSubmit(values);
      }
    });
  };

  // transfer切换
  const handleChange = (nextTarget) => {
    setCustomerErr(!nextTarget.length);
    setTargetData(nextTarget);
  };

  // 切换页数
  const onPageChange = (page) => {
    dispatch({
      type: 'getCustomerList',
      payload: {
        current: page,
      },
    });
    tranferRef.current.resetValues();
  };

  // currentEditItem有值代表编辑状态
  const title = currentEditItem ? '编辑客户分组' : '新增客户分组';
  const editItem = { ...currentEditItem };

  const dataSource = customerList.map((it) => ({
    label: it.customerName,
    value: it.customerId,
  }));
  // const targetData = (editItem.customers || []).map((it) => ({
  //   label: it.customerName,
  //   value: it.customerId,
  // }));

  const { getFieldDecorator } = form;

  return (
    <Modal
      visible={isShowModal}
      maskClosable={false}
      title={title}
      footer={false}
      wrapClassName="customer-group-modal"
      onCancel={closeModal}
      centered
    >
      <Form>
        <Form.Item label="分组名称">
          {getFieldDecorator('title', {
            initialValue: editItem.groupName || '',
            rules: [
              {
                required: true,
                message: '请输入分组名称',
              },
            ],
          })(
            <InputLimit
              autoComplete="off"
              maxLength={15}
              placeholder="请输入分组名称，最多15个字"
            />,
          )}
        </Form.Item>
        <Transfer
          ref={tranferRef}
          dataSource={dataSource}
          targetData={targetData}
          operations={['添加', '删除']}
          handleChange={handleChange}
          leftOptions={{
            customerSearch: searchInput({
              modalVisible: isShowModal,
              builtInGroupList,
              customerParams,
              dispatch,
            }),
            pagination:
              customerTotal > customerParams.pageSize
                ? {
                    current: customerParams.current,
                    onChange: onPageChange,
                    pageSize: customerParams.pageSize,
                    total: customerTotal,
                  }
                : false,
          }}
          rightOptions={{
            showSelectAll: { name: '已选客户' },
            filterOption: (value = '', list) => list.filter((it) => it.label.includes(value)),
            searchPlaceholder: '请输入客户名称搜索',
          }}
        />
        <p styleName="err-msg">{isCustomerErr ? '已选客户不能为空' : ''}</p>
        <div className="handle-row">
          <Button type="plain" onClick={closeModal}>
            取消
          </Button>
          <Button type="primary" onClick={onValidate} loading={addLoading || updateLoading}>
            保存
          </Button>
        </div>
      </Form>
    </Modal>
  );
}

const mapStateToProps = ({
  isShowCustomerModal,
  currentGroup,
  customerList,
  customerTotal,
  customerParams,
  builtInGroupList,
  loadings,
}) => ({
  isShowModal: isShowCustomerModal,
  currentEditItem: currentGroup,
  customerList,
  customerTotal,
  customerParams,
  builtInGroupList,
  addLoading: loadings.$addGroup,
  updateLoading: loadings.$updateGroup,
});

export default connect(mapStateToProps)(Form.create()(TheModal));
