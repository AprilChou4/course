// 功能组件 ZooExample.js
// 一个简易的 redux 封装就完成了，约 100 多行代码，不需要写 action，不需要写 switch case，异步请求简单，dispatch 功能强大，可以实现 3 种方法触发 effects 也可以很简洁。

// nuomi 中 redux 的实现原理基本与上述相同

// 以上代码可以正常使用，connect 方法的封装存在 ref 穿透等细节问题

import React, { useState, useEffect } from 'react';
import { connect } from '../../zoo';

const TestTodo = ({ dispatch, list, zooEffects }) => {
  const [value, setValue] = useState('');

  useEffect(() => {
    dispatch({ type: 'zoo/getAnimal' });
  }, []);

  const onAdd = () => {
    dispatch({
      type: 'zoo/addAnimal',
      payload: value,
    });
  };

  const onDelete = () => {
    zooEffects.deleteOne();
    // 或 dispatch.zooEffects.deleteOne();
  };

  return (
    <div>
      <input onChange={(e) => setValue(e.target.value)} />
      <button onClick={onAdd}>add animal</button>
      <button onClick={onDelete}>delete animal</button>
      <br />
      <ul>
        {list.map((item, i) => {
          return <li key={item + i}>{item}</li>;
        })}
      </ul>
    </div>
  );
};

export default connect(
  (state) => {
    return {
      list: state.zoo.list,
    };
  },
  {},
  // effects 注入
  ['todo', 'zoo'],
)(TestTodo);
