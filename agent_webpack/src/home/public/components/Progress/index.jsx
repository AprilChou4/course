import React, { useState, useEffect } from 'react';
import { Progress } from 'antd';

let timer = null;

const Prog = (props = {}) => {
  const [value, setValue] = useState(0);

  const setPercent = (v) => {
    v += Math.round(Math.random() * 9) + 8;
    v = v < 99 ? v : 99;

    setValue(v);

    if (v < 99) {
      timer = setTimeout(() => {
        setPercent(v);
      }, 200);
    }
  };

  useEffect(() => {
    setPercent(0);
    return () => {
      setValue(0);
      clearTimeout(timer);
    };
  }, []);

  return <Progress percent={value} strokeColor="#3FDCA2" {...props} />;
};

export default Prog;
