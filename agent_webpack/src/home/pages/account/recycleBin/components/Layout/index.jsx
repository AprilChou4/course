import React from 'react';
import { Drawer } from 'antd';
import { connect, router } from 'nuomi';
import postMessageRouter from '@utils/postMessage';
import Content from '../Content';
import './style.less';

const Index = ({ visible, dispatch }) => {
  const handleClose = () => {
    const { query } = router.location();

    if (query.visible) {
      postMessageRouter({
        type: 'agentAccount/routerLocation',
        payload: {
          url: '/account',
          query: {},
        },
      });
    }
    setTimeout(() => {
      dispatch({
        type: 'updateState',
        payload: {
          visible: false,
        },
      });
    }, 200);
  };

  return (
    <Drawer
      destroyOnClose
      title="回收站"
      width={798}
      visible={visible}
      onClose={handleClose}
      styleName="drawer"
      getContainer={false}
    >
      <Content />
    </Drawer>
  );
};

export default connect(({ visible }) => ({ visible }))(Index);
