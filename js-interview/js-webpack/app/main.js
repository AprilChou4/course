import React from 'react';
import ReactDOM from 'react-dom';
import Layout from './Layout';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import './main.css'; //使用require导入css文件
// 通常情况下，css会和js打包到同一个文件中，并不会打包为一个单独的css文件，
// 不过通过合适的配置webpack也可以把css打包为单独的文件的。\
function reducer(state = 0, action) {
  switch (action.type) {
    case 'ADD':
      return state + 1;
      break;
    case 'NO_ADD':
      return state - 1;
      break;
    default:
      return state;
      break;
  }
}
const store = createStore(reducer);
// console.log(store.getState());
ReactDOM.render(
  <Provider store={store}>
    <Layout />
  </Provider>,
  document.getElementById('root'),
);
