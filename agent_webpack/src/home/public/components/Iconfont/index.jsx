/* eslint-disable react/jsx-props-no-spreading */
import React, { forwardRef } from 'react';
import classnames from 'classnames';

const Iconfont = forwardRef(({ className, code, type, ...rest }, ref) => {
  return (
    <i
      {...rest}
      ref={ref}
      className={classnames('iconfont', className, { [`iconfont-${type}`]: type })}
    >
      {code}
    </i>
  );
});

export default Iconfont;
