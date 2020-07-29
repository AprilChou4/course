import React from 'react';
import { Drawer } from 'antd';
import { connect } from 'nuomi';
import Content from '../Content';
import './style.less';

const Index = ({ visible, dispatch }) => {
  const handleClose = () => {
    dispatch({
      type: 'updateState',
      payload: {
        visible: false,
      },
    });
  };

  return (
    <Drawer
      destroyOnClose
      title="账套交接"
      width={798}
      getContainer={false}
      visible={visible}
      onClose={handleClose}
      styleName="drawer"
    >
      <Content />
    </Drawer>
  );
};

export default connect(({ visible }) => ({ visible }))(Index);
