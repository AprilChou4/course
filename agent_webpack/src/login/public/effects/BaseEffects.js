export default class BaseEffects {
  constructor({ state, data, store: { id, dispatch, getState } }) {
    this.data = data;
    this.storeId = id;
    this.initialState = state;
    this.dispatch = dispatch;
    this.getState = getState;
  }

  // 设置状态
  updateState(payload) {
    this.dispatch({
      type: `_updateState`,
      payload,
    });
  }
}
