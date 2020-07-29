import React, { useCallback, useMemo } from 'react';
import { Button, message } from 'antd';
import { connect } from 'nuomi';
import pubData from 'data';
import { ShowConfirm } from '@components';
import styles from './style.less';

const userAuth = pubData.get('authority');
const { Group: ButtonGroup } = Button;
const Icons = ({ type }) => <i className="iconfont">{type}</i>;

const Operation = ({ curDeptKey, curDeptName, curDeptDisabled, dispatch }) => {
  const disAdd = useMemo(
    () => curDeptDisabled || ['未分配'].includes(curDeptName) || !userAuth[44],
    [curDeptDisabled, curDeptName],
  );
  const disEdit = useMemo(
    () => curDeptDisabled || ['全公司', '未分配'].includes(curDeptName) || !userAuth[45],
    [curDeptDisabled, curDeptName],
  );
  const disDelete = useMemo(
    () => curDeptDisabled || ['全公司', '未分配'].includes(curDeptName) || !userAuth[46],
    [curDeptDisabled, curDeptName],
  );

  const handleAdd = useCallback(() => {
    dispatch({
      type: 'showAddDeptModal',
    });
  }, [dispatch]);

  const handleEdit = useCallback(() => {
    dispatch({
      type: 'showEditDeptModal',
    });
  }, [dispatch]);

  const handleDelete = useCallback(() => {
    if (!curDeptKey) {
      message.warning('请选择部门');
      return;
    }

    ShowConfirm({
      title: `你确定要删除【${curDeptName || ''}】的信息吗？`,
      onOk() {
        return dispatch({
          type: '$deleteDept',
          payload: {
            deptId: curDeptKey,
          },
        });
      },
    });
  }, [curDeptKey, curDeptName, dispatch]);

  return (
    <ButtonGroup className={styles.btnGroup}>
      <Button type="primary" title="添加" disabled={disAdd} onClick={handleAdd}>
        <Icons type="&#xea0c;" />
      </Button>
      <Button type="primary" title="修改" disabled={disEdit} onClick={handleEdit}>
        <Icons type="&#xea0a;" />
      </Button>
      <Button type="primary" title="删除" disabled={disDelete} onClick={handleDelete}>
        <Icons type="&#xea09;" />
      </Button>
    </ButtonGroup>
  );
};

export default connect(
  ({ curDeptKey, curDeptNodes: { name: curDeptName, disabled: curDeptDisabled } }) => ({
    curDeptKey,
    curDeptName,
    curDeptDisabled,
  }),
)(Operation);
