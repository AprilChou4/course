import React from 'react';
import ReactDOM from 'react-dom';
import { Nuomi } from 'nuomi';

import home from './pages/agent';
import layout from './layout';
import '../home/public/config';
// 首页刚进来的页面css
import './public/style/index.less';

ReactDOM.render(
  <Nuomi {...layout} type={1}>
    <Nuomi {...home} />
  </Nuomi>,
  document.getElementById('app'),
);
