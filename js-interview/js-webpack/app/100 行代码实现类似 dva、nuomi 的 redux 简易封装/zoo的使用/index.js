import { Provider } from 'react-redux';

import zoo from './zoo';
import todoModel from './zooExample/Todo/model';
import zooModel from './zooExample/Zoo/model';
import ZooExample from './zooExample/index';

// 只需要传入各模块 model 即可
const zooStore = zoo.init({
  todoModel,
  zooModel,
});

render(
  <Provider store={zooStore}>
    <ZooExample />
  </Provider>,
  document.getElementById('root'),
);
