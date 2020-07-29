import React from 'react';
import Style from './style.less';

const Title = ({ title, subtitle }) => {
  return (
    <div className={`${Style['m-title']}`}>
      <h3>{title}</h3>
      <h4>{subtitle}</h4>
    </div>
  );
};

export default Title;
