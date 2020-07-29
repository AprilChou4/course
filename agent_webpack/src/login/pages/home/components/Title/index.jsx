import React from 'react';
import Style from './style.less';

const Title = ({ children }) => {
  return <div className={`${Style['m-title']}`}>{children}</div>;
};

export default Title;
