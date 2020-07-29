import React, { useCallback, useRef } from 'react';
import { AntdModal } from '@components';
import Content from './Content';

const EditDept = ({ visible, onCancel, onOk, data, ...restProps }) => {
  const contentRef = useRef(null);

  const handleOk = useCallback(() => {
    onOk(contentRef.current);
  }, [onOk]);

  return (
    <AntdModal
      title="编辑部门"
      className="withForm"
      width={443}
      getContainer={false}
      visible={visible}
      onCancel={onCancel}
      onOk={handleOk}
      {...restProps}
    >
      <Content wrappedComponentRef={contentRef} data={data} />
    </AntdModal>
  );
};

export default EditDept;
