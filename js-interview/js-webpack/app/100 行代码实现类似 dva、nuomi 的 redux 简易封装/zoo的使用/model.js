export default {
  namespace: 'zoo',
  state: {
    list: [],
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
    },
  },
  reducer: {
    setState: (payload, state) => ({ ...state, ...payload }),
  },
};
