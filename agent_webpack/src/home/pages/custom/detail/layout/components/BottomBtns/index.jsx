// 客户详情底部按钮
import React from 'react';
import { Button } from 'antd';
import pubData from 'data';
import { router } from 'nuomi';

export default function BottomBtns({ isEditing, onSave, onEdit, onCancle }) {
  const authoritys = pubData.get('authority');
  // isAlone 代表单点登录，不做权限控制，例如 财税助手
  const { isAlone, cszs: fromCszs } = router.location().query;

  function renderRightBtn() {
    // 无修改权限
    if (!authoritys['5'] && !isAlone) return null;
    return isEditing ? (
      <Button type="primary" onClick={onSave}>
        保存
      </Button>
    ) : (
      <Button type="primary" onClick={onEdit}>
        编辑
      </Button>
    );
  }

  return (
    <div className="form-handle-wrap">
      {!fromCszs && <Button onClick={onCancle}>取消</Button>}
      {renderRightBtn()}
    </div>
  );
}
