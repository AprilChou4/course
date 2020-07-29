// 黄色背景提示
import React from 'react';

import './style.less';

const WarnHint = ({ text = '警告', isIcon = true, isBorder = true, className }) => {
  return (
    <div className={`ui-warnHint ${isBorder ? 'ui-warnHint-border' : ''} ${className || ''}`}>
      {isIcon && <i className="iconfont">&#xec93;</i>}
      {text}
    </div>
  );
};
export default WarnHint;
