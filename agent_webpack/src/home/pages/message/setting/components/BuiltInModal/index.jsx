import React, { useState, useEffect } from 'react';
import { Modal, Button, Table, message } from 'antd';
import { connect } from 'nuomi';

import './index.less';

function BuiltInModal({ isShowModal, builtInGroupList, dispatch }) {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  useEffect(() => {
    const keys = builtInGroupList.filter((it) => it.selected).map((it) => it.type);
    setSelectedRowKeys(keys);
  }, [builtInGroupList]);

  // 关闭弹窗
  const closeModal = () => {
    dispatch({
      type: 'updateState',
      payload: {
        isShowBuiltInModal: false,
      },
    });
  };

  // 选择某一行
  const onSelectChange = (rowkeys) => {
    setSelectedRowKeys(rowkeys);
  };

  // 保存
  const onSubmit = async () => {
    const res = await dispatch({
      type: 'editDefaultGroup',
      payload: selectedRowKeys,
    });
    if (!res) {
      closeModal();
      dispatch({
        type: '$getBuiltInGroupList',
      });
      message.success('编辑成功');
    }
  };

  // columns
  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
      width: 90,
    },
    {
      title: '可选信息',
      dataIndex: 'classifyName',
      key: 'classifyName',
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const dataSource = builtInGroupList.map((item, index) => ({
    ...item,
    index: index > 9 ? index + 1 : `0${index + 1}`,
  }));

  return (
    <Modal
      centered
      visible={isShowModal}
      title="客户分类"
      footer={false}
      wrapClassName="builtin-group-modal"
      onCancel={closeModal}
    >
      <Table
        columns={columns}
        dataSource={dataSource}
        rowClassName="message-setting-builtin-row"
        rowKey="type"
        rowSelection={rowSelection}
        bordered
        pagination={false}
        scroll={{ y: 411 }}
      ></Table>
      <div className="handle-row">
        <Button type="plain" onClick={closeModal}>
          取消
        </Button>
        <Button type="primary" htmlType="submit" onClick={onSubmit}>
          保存
        </Button>
      </div>
    </Modal>
  );
}

const mapStateToProps = ({ isShowBuiltInModal, builtInGroupList }) => ({
  isShowModal: isShowBuiltInModal,
  builtInGroupList,
});

export default connect(mapStateToProps)(BuiltInModal);
