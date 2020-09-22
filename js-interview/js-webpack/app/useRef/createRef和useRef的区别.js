// 利用useRef / creatRef 都可以实现input聚焦
import React, { useState, useEffect, useRef, createRef } from 'react';
import config from './config.json';
import { connect } from 'react-redux';
import { Input, Button } from 'antd';
// createRef 每次渲染都会返回一个新的引用，而 useRef 每次都会返回相同的引用。
const Counter = ({ state, dispatch }) => {
  const [count, setCount] = useState(0);

  const refFromUseref = useRef();
  const refFromCreateRef = createRef();

  console.log(refFromUseref, !refFromUseref, '--refFromUseref');
  console.log(refFromCreateRef.current, '每次重新渲染都是null或者undefined----refFromCreateRef');
  if (!refFromUseref.current) {
    refFromUseref.current = count;
  }
  if (!refFromCreateRef.current) {
    refFromCreateRef.current = count;
  }
  return (
    <div>
      <button
        onClick={() => {
          setCount(count + 1);
        }}
      >
        点击
      </button>
      <div>count:{count}</div>
      <div>refFromUseref count: {refFromUseref.current},</div>
      <div>refFromCreateRef count: {refFromCreateRef.current},</div>
    </div>
  );
};
function mapStateToProps(state) {
  return {
    state,
  };
}
export default connect(mapStateToProps)(Counter);
