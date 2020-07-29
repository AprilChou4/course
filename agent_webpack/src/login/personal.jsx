import React from 'react';
import ReactDOM from 'react-dom';
import { Nuomi } from 'nuomi';
import home from './pages/personal';
import layout from './layout';
import '../home/public/config';
import './public/style/index.less';

ReactDOM.render(
  <Nuomi {...layout} type={0}>
    <Nuomi {...home} />
  </Nuomi>,
  document.getElementById('app'),
);
