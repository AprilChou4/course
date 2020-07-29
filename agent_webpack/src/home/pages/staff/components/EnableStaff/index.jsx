import React, { useCallback, useRef } from 'react';
import classnames from 'classnames';
import { AntdModal } from '@components';
import Content from './Content';
import styles from './style.less';

const EnableStaff = ({ visible, onCancel, onOk, data, ...restProps }) => {
  const contentRef = useRef(null);

  const handleOk = useCallback(() => {
    onOk(contentRef.current);
  }, [onOk]);

  return (
    <AntdModal
      title="启用员工"
      className={classnames('withForm', styles.modal)}
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

export default EnableStaff;
