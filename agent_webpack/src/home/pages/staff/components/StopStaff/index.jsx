import React, { useMemo } from 'react';
import classnames from 'classnames';
import { AntdModal } from '@components';
import { get } from '@utils';
import Content from './Content';
import styles from './style.less';

const AddDept = ({ visible, onCancel, onOk, data, ...restProps }) => {
  const assignStatistics = useMemo(() => get(data, 'assignStatistics', []), [data]);

  const okBtnDisabled = useMemo(() => assignStatistics.some((item) => item && item.count > 0), [
    assignStatistics,
  ]);

  return (
    <AntdModal
      title="停用"
      okText="停用"
      cancelText="关闭"
      width={465}
      getContainer={false}
      okButtonProps={{ disabled: okBtnDisabled }}
      className={classnames('withForm', styles.modal)}
      visible={visible}
      onCancel={onCancel}
      onOk={onOk}
      {...restProps}
    >
      <Content data={data} />
    </AntdModal>
  );
};

export default AddDept;
