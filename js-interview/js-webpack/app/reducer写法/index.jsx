//Greeter,js
import React, { useState, useEffect, useRef } from 'react';
import config from './config.json';
import { connect } from 'react-redux';
const Counter = ({ state, dispatch }) => {
  return (
    <div>
      {state}
      <button
        onClick={() =>
          dispatch({
            type: 'ADD',
          })
        }
      >
        +
      </button>

      <button
        onClick={() =>
          dispatch({
            type: 'NO_ADD',
          })
        }
      >
        -
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
