import React from 'react';
import { Spin } from 'antd';
import style from './style.less';

const Loading = () => {
  return (
    <div className={style.loading}>
      <Spin size="large" tip="正在初始化..." />
    </div>
  );
};

export const LoadData = ({ loading }) => {
  return (
    <div className={style.loading}>
      <Spin tip={loading === true ? '加载中...' : loading} />
    </div>
  );
};

export default Loading;
