import React, { useCallback, useMemo, useRef } from 'react';
import { AntdModal } from '@components';
import { get } from '@utils';
import Content from './Content';
import AdminEditSelfContent from './AdminEditSelfContent';

const AddDept = ({ visible, onCancel, onOk, data, ...restProps }) => {
  const contentRef = useRef(null);
  const staffModalType = useMemo(() => get(data, 'staffModalType'), [data]);

  const handlCancel = useCallback(() => {
    onCancel(contentRef.current);
  }, [onCancel]);

  const handleOk = useCallback(() => {
    onOk(contentRef.current);
  }, [onOk]);

  return (
    <AntdModal
      className="withForm"
      width={680}
      getContainer={false}
      visible={visible}
      onCancel={handlCancel}
      onOk={handleOk}
      {...restProps}
    >
      {staffModalType === 3 ? (
        <AdminEditSelfContent wrappedComponentRef={contentRef} data={data} />
      ) : (
        <Content wrappedComponentRef={contentRef} data={data} />
      )}
    </AntdModal>
  );
};

export default AddDept;
