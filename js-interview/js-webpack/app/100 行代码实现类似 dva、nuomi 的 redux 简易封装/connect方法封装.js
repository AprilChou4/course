import React from 'react';
import { connect } from 'react-redux';
import zoo from './zoo';

// effectsArr 可作为 effects 依赖注入使用
export default (mapState, mapDispatch = {}, effectsArr = []) => {
  return (Component) => {
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

    const NewComponent = (props) => {
      const { effects } = zoo;
      const effectsProps = {};
      // 组件中扩展加入 effects 对象，更方便调用 effects 中的方法
      effectsArr.forEach((item) => {
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
