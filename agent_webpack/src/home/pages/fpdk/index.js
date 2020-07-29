// 发票代开（目前用不到）
import React from 'react';
import Frame from './Frame';

export default {
  wrapper: true,
  state: {
    path: '',
  },
  onChange: {
    change() {
      // this.location;
      this.store.dispatch({
        type: '_updateState',
        payload: {
          path: '',
        },
      });
    },
    sdsd() {},
  },
  render() {
    return <Frame />;
  },
};
