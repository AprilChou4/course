
## 实现功能类似 dva、nuomi、rematch、mirror

redux 原生写法实现功能需要写大量的 action、reducer 模板代码，对于复杂项目来说代码量
太多，且 action 文件和 reducer 文件等不停切换较为繁琐，开发体验较差。一般都会经过封装简化。

比如 dva 的实现方式，采用 model 的方式，并引入了 effects，把 state、effects、action、reducer 放在一个文件，简化了 action 和 reducer 的定义方式。现在简单实现下类似封装方式。

## 实现代码

### 命名 zoo，因为 z 字母开头文件列表中在最底部，方便查找

直接上代码，实现 redux 主体功能封装

```
import { createStore } from 'redux';
import { Provider } from 'react-redux';

// 为 effects 或 reducer 添加 namespace, 方便保存到全局
const addNamespace = (obj, name) => {
  const newObj = {};
  Object.keys(obj).forEach(item => {
    newObj[`${name}/${item}`] = obj[item];
  });
  return newObj;
};

class Zoo {
  constructor() {
    // 定义公共 state、store、effects 等
    this.state = {};
    this.models = {};
    this.reducers = {};
    this.effects = {};
    this.store = {};
  }

  // zoo 初始化方法，传入每个模块的 model
  init(models) {
    Object.values(models).forEach(item => {
      // 遍历加载每个 model
      this.model(item);
    });

    // 创建并返回全局 store
    return this.createStore();
  }

  // 加载模块 model 方法
  model(modelObj) {
    const { state, reducer, effects, namespace } = modelObj;
    // 全局保存 state
    this.state[namespace] = state;
    this.models[namespace] = modelObj;

    // 保存 reducer
    const newReducer = addNamespace(reducer, namespace);
    this.reducers[namespace] = newReducer;

    // 保存 effects
    this.effects[namespace] = effects;
  }

  createStore() {
    // 合并 reducer, 创建 reducer 函数
    const reducer = (state = this.state, action) => {
      let newState = state;

      const { type, payload } = action;
      // 获取每个 action 的 namespace
      const [namespace, typeName] = type.split('/');

      // 根据 namespace 获取对应 model 中 state 和 reducer 函数对象
      const currentState = newState[namespace];
      const currentReducer = this.reducers[namespace];

      // 如果 action 对应 reducer 存在，则根据函数修改 state，否则直接返回原 state
      if (currentReducer && currentReducer[type] && currentState) {
        // 根据 reducer 函数修改当前 namespace 的 state
        newState[namespace] = currentReducer[type](payload, currentState);
        // 修改后的 state 必须是新的对象，这样才不会覆盖旧的 state，可以使修改生效
        newState = { ...newState };
      }

      return newState;
    };

    // 调用 redux createStore 创建 store
    this.store = createStore(reducer);

    const { dispatch, getState } = this.store;

    /**
     * 给每个 model 的 effects 对象添加全局 store 的 dispatch、getState 方法
     * 用于在 effects 中调用 dispatch
     * 同时对 effects 中的方法名添加 namespace, 用于组件中 dispatch 时区分模块
     */
    Object.keys(this.effects).forEach(namespace => {
      this.effects[namespace].dispatch = ({ type, payload }) =>
        // 修改 action type，添加 namespace
        dispatch({ type: `${namespace}/${type}`, payload });
      this.effects[namespace].getState = getState;
    });

    return this.store;
  }
}

export default new Zoo();
```

### connect 方法封装

```js
import React from 'react';
import { connect } from 'react-redux';
import zoo from './zoo';

// effectsArr 可作为 effects 依赖注入使用
export default (mapState, mapDispatch = {}, effectsArr = []) => {
  return Component => {
    const { getState, dispatch } = zoo.store;

    // 修改组件中的 dispatch 默认先触发 effects 中对应方法,不存在时作为正常 action dispatch
    const myDispatch = ({ type, payload }) => {
      const [typeId, typeName] = type.split('/');
      const { effects } = zoo;

      if (effects[typeId] && effects[typeId][typeName]) {
        return effects[typeId][typeName](payload);
      }

      dispatch({ type, payload });
    };

    const NewComponent = props => {
      const { effects } = zoo;
      const effectsProps = {};
      // 组件中扩展加入 effects 对象，更方便调用 effects 中的方法
      effectsArr.forEach(item => {
        if (effects[item]) {
          effectsProps[`${item}Effects`] = effects[item];
          myDispatch[`${item}Effects`] = effects[item];
        }
      });

      return <Component {...props} dispatch={myDispatch} {...effectsProps} />;
    };

    return connect(mapState, mapDispatch)(NewComponent);
  };
};
```

如上，封装后的 connect 扩展了很多功能，组件中获得的 dispatch 不再仅仅触发 action，而是直接
调用 effects 中的方法，更方便副作用处理，同时增加了 effects 依赖注入的接口（类似 Mobx 中的 inject)。

如上，zoo 实现完成，zoo 创建的 store 和 redux 原生创建的 store 并没有区别。

## zoo 使用

### index.js

```js
import { Provider } from 'react-redux';

import zoo from './zoo';
import todoModel from './zooExample/Todo/model';
import zooModel from './zooExample/Zoo/model';
import ZooExample from './zooExample/index';

// 只需要传入各模块 model 即可
const zooStore = zoo.init({
  todoModel,
  zooModel
});

render(
  <Provider store={zooStore}>
    <ZooExample />
  </Provider>,
  document.getElementById('root')
);
```

### model.js

```
export default {
  namespace: 'zoo',
  state: {
    list: []
  },
  effects: {
    setState(payload) {
      const state = this.getState();
      this.dispatch({ type: 'setState', payload: payload });
    },
    addAnimal(name) {
      const { list } = this.getState().zoo;
      this.setState({ list: [...list, name] });
    },
    async deleteOne() {
      const { list } = this.getState().zoo;
      const res = [...list];
      // 模拟异步请求操作
      setTimeout(() => {
        res.pop();

        this.setState({ list: res });
      }, 1000);
    }
  },
  reducer: {
    setState: (payload, state) => ({ ...state, ...payload })
  }
};
```

### 功能组件 ZooExample.js

```js
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
      payload: value
    });
  };

  const onDelete = () => {
    zooEffects.deleteOne();
    // 或 dispatch.zooEffects.deleteOne();
  };

  return (
    <div>
      <input onChange={e => setValue(e.target.value)} />
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
  state => {
    return {
      list: state.zoo.list
    };
  },
  {},
  // effects 注入
  ['todo', 'zoo']
)(TestTodo);

```

一个简易的 redux 封装就完成了，约 100 多行代码，不需要写 action，不需要写 switch case，异步请求简单，dispatch 功能强大，可以实现 3 种方法触发 effects 也可以很简洁。

> nuomi 中 redux 的实现原理基本与上述相同

> 以上代码可以正常使用，connect 方法的封装存在 ref 穿透等细节问题

> 示例代码仓库 https://github.com/iblq/zoo

