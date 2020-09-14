import React, { useState } from 'react';
import styles from './index.css';

export default () => {
  const [data, setData] = useState({});
  window.addEventListener(
    'message',
    function (event) {
      // 监听父窗口发送过来的数据向服务器发送post请求

      var data = event.data;
      setData(data);
      console.log(data, '----- 监听父窗口发送过来的数据----dsada----------------');
    },
    false,
  );
  return (
    <div>
      <h1
        className={styles.title}
        onClick={() => window.parent.postMessage({ name: 'april' }, '*')}
      >
        {data.king || 'Page index'}
      </h1>
    </div>
  );
};
