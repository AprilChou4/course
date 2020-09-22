// 利用useRef / creatRef 都可以实现input聚焦
import React, { useState, useEffect, useRef, createRef } from 'react';
import config from './config.json';
import { connect } from 'react-redux';
import { Input, Button } from 'antd';
const Counter = ({ state, dispatch }) => {
  const inputRef = useRef(null);
  const inputCreateRef = createRef(null);
  return (
    <div>
      <div>useRef</div>
      <Input ref={inputRef} />
      <Button
        onClick={() => {
          inputRef.current.focus();
        }}
      >
        点击
      </Button>
      <div>createRef</div>
      <Input ref={inputCreateRef} />
      <Button
        onClick={() => {
          inputCreateRef.current.focus();
        }}
      >
        点击
      </Button>
    </div>
  );
};
function mapStateToProps(state) {
  return {
    state,
  };
}
export default connect(mapStateToProps)(Counter);
