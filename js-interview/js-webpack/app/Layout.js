// 利用useRef / creatRef 都可以实现input聚焦
import React, { useState, useEffect, useRef, createRef } from 'react';
import config from './config.json';
import { connect } from 'react-redux';
import { Input, Button } from 'antd';
// createRef 每次渲染都会返回一个新的引用，而 useRef 每次都会返回相同的引用。
const Counter = ({ state, dispatch }) => {
  const [count, setCount] = useState(0);
  const btnRef = useRef(null);

  // useEffect(() => {
  //   const handleOnclick = () => {
  //     setCount(count + 1);
  //   };
  //   btnRef.current.addEventListener('click', handleOnclick, false);
  //   return () => {
  //     btnRef.current.removeEventListener('click', handleOnclick, false);
  //   };
  // }, [count]);

  return (
    <div>
      count: {count}
      <button
        ref={btnRef}
        onClick={() => {
          setCount(count + 1);
        }}
      >
        +1
      </button>
    </div>
  );
};
function mapStateToProps(state) {
  return {
    state,
  };
}
export default connect(mapStateToProps)(Counter);
