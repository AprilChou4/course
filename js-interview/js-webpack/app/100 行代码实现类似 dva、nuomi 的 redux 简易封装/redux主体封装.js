// 命名 zoo，因为 z 字母开头文件列表中在最底部，方便查找
// 直接上代码，实现 redux 主体功能封装
import { createStore } from 'redux';
import { Provider } from 'react-redux';

// 为 effects 或 reducer 添加 namespace, 方便保存到全局
const addNamespace = (obj, name) => {
  const newObj = {};
  Object.keys(obj).forEach((item) => {
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
    Object.values(models).forEach((item) => {
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
    Object.keys(this.effects).forEach((namespace) => {
      this.effects[namespace].dispatch = ({ type, payload }) =>
        // 修改 action type，添加 namespace
        dispatch({ type: `${namespace}/${type}`, payload });
      this.effects[namespace].getState = getState;
    });

    return this.store;
  }
}

export default new Zoo();
