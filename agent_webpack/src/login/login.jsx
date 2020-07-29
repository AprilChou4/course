import React from 'react';
import ReactDOM from 'react-dom';
import { message as Message } from 'antd';
import { Nuomi } from 'nuomi';
import home from './pages/home';
import '../home/public/config';
import layout from './layout';
import './public/style/index.less';

Message.config({
  duration: 2,
  maxCount: 1,
  top: '50%',
});
ReactDOM.render(
  <Nuomi {...layout} type={2}>
    <Nuomi {...home} />
  </Nuomi>,

  document.getElementById('app'),
);
